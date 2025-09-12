import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { type ReactSketchCanvasRef } from "react-sketch-canvas";
import type { RootState, AppDispatch } from "../store/store";
import { setCurrentDiary, addMessage, resetDiaryState, setTempGuestId, setIsAiResponding } from "../store/diarySlice";
import type { Diary, ChatMessage } from "../store/diarySlice";
import axiosInstance from "../api/axiosInstance";

// UI Components
import DiaryDisplay from "../components/diary_components/DiaryDisplay";
import DoodleCanvas from "../components/diary_components/DoodleCanvas";
import AIChat from "../components/diary_components/AIChat";

// Utils
import { getKoreanDateString } from "../utils/dateUtils";
import { getEmotionColor } from "../utils/colorUtils";

function DiaryPage() {
    const dispatch: AppDispatch = useDispatch();
    const location = useLocation();

    // Redux Global State
    const { isAuthenticated } = useSelector((s: RootState) => s.auth);
    const { currentDiary, tempGuestId } = useSelector((s: RootState) => s.diary);

    // Component Local State
    const [isLoading, setIsLoading] = useState(true);
    // ✅ [수정] isAiResponding 로컬 상태 제거. Redux의 전역 상태를 사용합니다.
    const [diaryText, setDiaryText] = useState("");
    const [moodColor, setMoodColor] = useState("#FFFFFF");
    const canvasRef = useRef<ReactSketchCanvasRef>(null);

    const selectedDate = location.state?.select_date ? new Date(location.state.select_date) : new Date();
    const selectedDateStr = getKoreanDateString(selectedDate);
    const isToday = selectedDateStr === getKoreanDateString(new Date());

    // 페이지 진입 시 기존 일기 데이터 로드
    useEffect(() => {
        setIsLoading(true);
        const tempDiary: Diary = {
            diaryId: -1,
            diaryText: '',
            createdAt: selectedDate.toISOString(),
        };

        if (isAuthenticated) {
            axiosInstance.get<Diary>("/diary", { params: { date: selectedDateStr } })
                .then(res => {
                    const loadedDiary = res.data;
                    if (loadedDiary && loadedDiary.diaryId) {
                        const initialMessages: ChatMessage[] = (loadedDiary.chatDtos || []).map((chat: { sender: string; message: string; }) => ({
                            sender: chat.sender as 'user' | 'ai',
                            message: chat.message
                        }));
                        dispatch(setCurrentDiary({ diary: loadedDiary, messages: initialMessages }));
                    } else {
                        dispatch(setCurrentDiary({ diary: tempDiary, messages: [] }));
                    }
                })
                .catch(() => dispatch(setCurrentDiary({ diary: tempDiary, messages: [] })))
                .finally(() => setIsLoading(false));
        } else {
            dispatch(setCurrentDiary({ diary: tempDiary, messages: [] }));
            setIsLoading(false);
        }

        return () => { dispatch(resetDiaryState()); };
    }, [selectedDateStr, isAuthenticated, dispatch]);

    // '저장 및 AI 분석' 버튼 핸들러
    const handleSaveAndConsult = useCallback(async () => {
        if (!diaryText.trim()) return;
        setIsLoading(true);

        // ✅ 함수 시작 시점에 dataUrl을 미리 생성합니다.
        const dataUrl = await canvasRef.current?.exportImage("png");
        const doodleBlob = dataUrl ? await (await fetch(dataUrl)).blob() : null;
        const doodleFile = doodleBlob ? new File([doodleBlob], "doodle.png", { type: "image/png" }) : null;

        const formData = new FormData();
        formData.append('diaryText', diaryText);
        if (doodleFile) formData.append('file', doodleFile);

        try {
            if (isAuthenticated) {
                // --- 회원 로직 (이전과 동일) ---
                const diaryRes = await axiosInstance.post('/diary', { diaryText, moodColor, date: selectedDateStr });
                const savedDiary: Diary = diaryRes.data;

                let finalDoodleUrl = savedDiary.doodleUrl;
                if (doodleFile) {
                    const doodleFormData = new FormData();
                    doodleFormData.append('file', doodleFile);
                    doodleFormData.append('diaryId', savedDiary.diaryId.toString());
                    const doodleRes = await axiosInstance.post('/doodles', doodleFormData);
                    finalDoodleUrl = doodleRes.data.imageUrl;
                }
                formData.append('diaryId', savedDiary.diaryId.toString());

                const analysisRes = await axiosInstance.post('/analysis/ai', formData);
                const { counseling_response: counselingResponse, main_emotion: mainEmotion } = analysisRes.data;

                const finalDiaryObject: Diary = {
                    ...savedDiary,
                    doodleUrl: finalDoodleUrl,
                    moodColor: getEmotionColor(mainEmotion),
                    aiCounselingText: counselingResponse,
                };

                dispatch(setCurrentDiary({
                    diary: finalDiaryObject,
                    messages: [{ sender: 'ai', message: counselingResponse }]
                }));

            } else {
                // --- 비회원 로직 ---
                formData.append('diaryId', '-1');

                const analysisRes = await axiosInstance.post('/analysis/ai', formData);
                const { counseling_response: counselingResponse, main_emotion: mainEmotion, temp_guest_id: newTempGuestId } = analysisRes.data;
                // ✅ [디버깅 1] 비회원: API 응답 데이터 전체를 확인합니다.
                console.log("GUEST - API Response:", analysisRes.data);

                if (newTempGuestId) {
                    dispatch(setTempGuestId(newTempGuestId));
                }

                const tempDiaryToUpdate: Diary = {
                    diaryId: -1,
                    diaryText,
                    moodColor: getEmotionColor(mainEmotion),
                    createdAt: new Date().toISOString(),
                    aiCounselingText: counselingResponse,
                    doodleUrl: dataUrl || undefined // ✅ [수정] 누락되었던 그림 URL을 추가합니다.
                };
                // ✅ [디버깅 2] 비회원: Redux로 보내기 직전의 최종 객체를 확인합니다.
                console.log("GUEST - Dispatching Diary Object:", tempDiaryToUpdate);


                dispatch(setCurrentDiary({
                    diary: tempDiaryToUpdate,
                    messages: [{ sender: 'ai', message: counselingResponse }]
                }));
            }
        } catch (err) { console.error("분석 요청 실패:", err); }
        finally { setIsLoading(false); }
    }, [isAuthenticated, diaryText, moodColor, selectedDateStr, dispatch]);

    // AI 채팅 메시지 전송 핸들러
    const handleNewMessage = useCallback(async (userInput: string) => {
        const userMessage: ChatMessage = { sender: 'user', message: userInput };
        dispatch(addMessage(userMessage));
        dispatch(setIsAiResponding(true)); // ✅ [수정] Redux 액션을 dispatch

        try {
            let payload: object;
            if (isAuthenticated && currentDiary) {
                payload = { diaryId: currentDiary.diaryId, message: userInput };
            } else if (tempGuestId) {
                payload = { temp_username: tempGuestId, message: userInput };
            } else {
                throw new Error("채팅을 위한 사용자 정보가 없습니다.");
            }

            const res = await axiosInstance.post("/analysis/chat", payload);

            // Spring Boot의 AiCounselingResponseDto 필드명인 counselingText를 사용
            if (res.data && res.data.counselingText) {
                const aiMessage: ChatMessage = { sender: 'ai', message: res.data.counselingText };
                dispatch(addMessage(aiMessage));
            } else {
                throw new Error("AI 응답 형식이 올바르지 않습니다.");
            }
        } catch (err) {
            console.error("채팅 메시지 전송 실패:", err);
            dispatch(addMessage({ sender: 'ai', message: '죄송합니다, 오류가 발생했습니다.' }));
        } finally {
            dispatch(setIsAiResponding(false)); // ✅ [수정] Redux 액션을 dispatch
        }
    }, [dispatch, currentDiary, isAuthenticated, tempGuestId]); // messages는 의존성 배열에서 제거


    if (isLoading) return <p className="text-center p-10">⏳ 로딩 중...</p>;

    return (
        <div className="w-full h-full mt-10 flex justify-center">
            <div className="flex flex-wrap justify-center w-full max-w-[1700px] gap-6 px-4">
                {/* 왼쪽: 일기 작성 및 표시 영역 */}
                <div className="flex flex-col min-w-[600px] max-w-[800px] flex-1">
                    <div className="p-6 border border-gray-200 rounded-2xl shadow-sm bg-white w-full">
                        {currentDiary && currentDiary.diaryText ? (
                            <DiaryDisplay diary={currentDiary} />
                        ) : (
                            <div>
                                <h2 className="text-2xl font-bold mb-4 text-[#4D4F94]">
                                    ✏️ {selectedDateStr}의 새 일기
                                </h2>
                                <textarea
                                    value={diaryText}
                                    onChange={(e) => setDiaryText(e.target.value)}
                                    rows={8}
                                    className="w-full p-2 border rounded"
                                    placeholder="오늘의 일기를 적어주세요"
                                    disabled={!isToday}
                                />
                                <input
                                    type="color"
                                    value={moodColor}
                                    onChange={(e) => setMoodColor(e.target.value)}
                                    className="w-full h-10 mt-2"
                                    disabled={!isToday}
                                />
                                <DoodleCanvas ref={canvasRef} editable={isToday} />
                                <button
                                    onClick={handleSaveAndConsult}
                                    disabled={!isToday || isLoading}
                                    className="mt-4 w-full bg-[#7286D3] text-white p-3 rounded-lg font-semibold disabled:bg-gray-400"
                                >
                                    {isToday ? (isLoading ? "처리 중..." : "저장 및 AI 분석") : "오늘의 일기만 작성 가능합니다"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* 오른쪽: AI 채팅 영역 */}
                <div className="min-w-[600px] max-w-[8-00px] flex-1">
                    {currentDiary?.aiCounselingText ? (
                        <AIChat onSendMessage={handleNewMessage} />
                    ) : (
                        <div className="p-6 border rounded-2xl bg-white h-full flex items-center justify-center">
                            <p className="text-center text-gray-500">
                                일기를 작성하고 분석을 완료하면<br /> AI와 대화를 시작할 수 있습니다.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DiaryPage;
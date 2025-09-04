import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { type ReactSketchCanvasRef } from "react-sketch-canvas";
import type { RootState, AppDispatch } from "../store/store";
import { setCurrentDiary, addMessage, resetDiaryState, setMessages } from "../store/diarySlice";
import type { Diary, ChatMessage } from "../store/diarySlice";
import axiosInstance from "../api/axiosInstance";

// UI 컴포넌트들을 import 합니다.
import DiaryDisplay from "../components/diary_components/DiaryDisplay";
import DoodleCanvas from "../components/diary_components/DoodleCanvas";
import AIChat from "../components/diary_components/AIChat";
import { getKoreanDateString } from "../utils/dateUtils";


function DiaryPage() {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // --- Redux에서 모든 관련 상태를 가져옵니다 ---
    const { isAuthenticated } = useSelector((s: RootState) => s.auth);
    const { currentDiary, messages } = useSelector((s: RootState) => s.diary);

    // --- 이 페이지에서만 사용하는 로컬 상태 ---
    const [isLoading, setIsLoading] = useState(true);
    const [isAiResponding, setIsAiResponding] = useState(false);
    const [diaryText, setDiaryText] = useState("");
    const [moodColor, setMoodColor] = useState("#FFFFFF");
    const canvasRef = useRef<ReactSketchCanvasRef>(null);

    const selectedDate = location.state?.select_date ? new Date(location.state.select_date) : new Date();
    const selectedDateStr = getKoreanDateString(selectedDate);
    const isToday = selectedDateStr === getKoreanDateString(new Date());

    // --- 3. 기존 일기를 불러오는 로직 ---
    useEffect(() => {
        setIsLoading(true);
        const tempDiary: Diary = {
            diaryId: -1,
            createdAt: selectedDate.toISOString(), // 현재 시간이 아닌 선택된 날짜로 설정
        };
        if (isAuthenticated) {
            axiosInstance.get<Diary>("/diary", { params: { date: selectedDateStr } })
                .then(res => {
                    alert(res.data);
                    const loadedDiary = res.data;
                    if (loadedDiary && loadedDiary.diaryId) {
                        let initialMessages: ChatMessage[] = [];

                        // chatDtos가 존재하고 배열인 경우에만 변환 작업을 수행합니다.
                        if (loadedDiary.chatDtos && Array.isArray(loadedDiary.chatDtos)) {
                            initialMessages = loadedDiary.chatDtos.map(chatDto => {
                                // ChatDto에서 sender와 message 속성만 추출하여
                                // ChatMessage 형태의 새 객체를 만듭니다.
                                return {
                                    sender: chatDto.sender as 'user' | 'ai', // 타입 단언
                                    message: chatDto.message
                                };
                            });
                        }
                        // 유효한 일기가 있을 때만 상태를 업데이트합니다.
                        dispatch(setCurrentDiary({ diary: loadedDiary, messages: initialMessages }));
                    } else {
                        // 유효한 일기가 아니면, 일기가 없는 것으로 간주하고 상태를 null로 설정합니다.
                        dispatch(setCurrentDiary({ diary: tempDiary, messages: [] }));
                    }
                })
                .catch(() => dispatch(setCurrentDiary({ diary: tempDiary, messages: [] })))
                .finally(() => setIsLoading(false));
        } else {
            // 비회원은 과거 일기를 불러올 수 없으므로 항상 null 처리
            dispatch(setCurrentDiary({ diary: tempDiary, messages: [] }));
            setIsLoading(false);
        }

        return () => { dispatch(resetDiaryState()); };
    }, [selectedDateStr, isAuthenticated, dispatch]);


    // --- 2. 회원/비회원을 모두 처리하는 '저장 및 분석' 함수 ---
    const handleSaveAndConsult = useCallback(async () => {
        if (!diaryText.trim()) return;
        setIsLoading(true);

        const dataUrl = await canvasRef.current?.exportImage("png");
        const doodleFile = dataUrl ? await (await fetch(dataUrl)).blob() : null;

        try {
            if (isAuthenticated) { // --- 회원 로직 ---
                const diaryRes = await axiosInstance.post('/diary', { diaryText, moodColor, date: selectedDateStr });
                const savedDiary: Diary = diaryRes.data;

                if (doodleFile) {
                    const doodleFormData = new FormData();
                    doodleFormData.append('file', doodleFile, 'doodle.png');
                    doodleFormData.append('diaryId', savedDiary.diaryId.toString());
                    await axiosInstance.post('/doodles', doodleFormData);
                }

                const analysisFormData = new FormData();
                analysisFormData.append('diaryId', savedDiary.diaryId());
                analysisFormData.append('diaryText', diaryText);
                if (doodleFile) analysisFormData.append('file', doodleFile, 'doodle.png');

                const analysisRes = await axiosInstance.post('/analysis/ai', analysisFormData);
                const analysisText = analysisRes.data.counselingText;

                const finalDiaryData = { ...savedDiary, aiCounselingText: analysisText };
                dispatch(setCurrentDiary(finalDiaryData));
                dispatch(setMessages([{ sender: 'ai', message: analysisText }]));

            } else { // --- 비회원 로직 ---
                const analysisFormData = new FormData();
                analysisFormData.append('diaryText', diaryText);
                if (doodleFile) analysisFormData.append('file', doodleFile, 'doodle.png');

                const analysisRes = await axiosInstance.post('/analysis/ai', analysisFormData);
                const analysisText = analysisRes.data.counselingText;

                // 비회원은 DB 저장이 없으므로, 임시 Diary 객체를 만들어 Redux에 저장
                const tempDiary: Diary = {
                    diaryId: -1, // 임시 ID
                    diaryText, moodColor, createdAt: new Date().toISOString(),
                    aiCounselingText: analysisText
                };
                dispatch(setCurrentDiary(tempDiary));
                dispatch(setMessages([{ sender: 'ai', message: analysisText }]));
            }
        } catch (err) { console.error(err); }
        finally { setIsLoading(false); }
    }, [isAuthenticated, diaryText, moodColor, selectedDateStr, dispatch]);


    // --- AI 채팅 메시지 전송 로직 ---
    const handleNewMessage = useCallback(async (userInput: string) => {
        const userMessage: ChatMessage = { sender: 'user', message: userInput };
        dispatch(addMessage(userMessage));
        setIsAiResponding(true);

        const currentMessages = [...messages, userMessage];

        try {
            const res = await axiosInstance.post("/analysis/chat", {
                diaryId: currentDiary?.diaryId, // 회원이면 diaryId, 비회원은 -1
                message: userInput,
                pastMessages: currentMessages
            });

            if (res.data && res.data.counselingText) {
                const aiMessage: ChatMessage = { sender: 'ai', message: res.data.counselingText };
                dispatch(addMessage(aiMessage));
            }
        } catch (err) {
            dispatch(addMessage({ sender: 'ai', message: '죄송합니다, 오류가 발생했습니다.' }));
        } finally {
            setIsAiResponding(false);
        }
    }, [dispatch, currentDiary, messages]);

    if (isLoading) return <p className="text-center p-10">⏳ 로딩 중...</p>;

    return (
        <div className="w-full h-full mt-10 flex justify-center">
            <div className="flex flex-wrap justify-center w-full max-w-[1700px] gap-6 px-4">
                {/* 왼쪽 영역 */}
                <div className="flex flex-col min-w-[600px] max-w-[800px] flex-1">
                    <div className="p-6 border border-gray-200 rounded-2xl shadow-sm bg-white w-full">
                        {currentDiary && currentDiary.diaryText != null ? (
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
                                    placeholder="오늘의 이야기를 들려주세요..."
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

                {/* 오른쪽 영역 */}
                <div className="min-w-[600px] max-w-[800px] flex-1">
                    {currentDiary ? (
                        <AIChat
                            isAiLoading={isAiResponding}
                            onSendMessage={handleNewMessage}
                        />
                    ) : (
                        <div className="p-6 border rounded-2xl bg-white h-full flex items-center justify-center">
                            <p className="text-center text-gray-500">
                                일기를 불러오거나 새로 작성하고 분석을 완료하면<br /> AI와 대화를 시작할 수 있습니다.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DiaryPage;
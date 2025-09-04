import { useSelector } from "react-redux";
import DiaryViewer from "../components/diary_components/DiaryViewer";
import type { RootState } from "../store/store";
import {useCallback, useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import AIChat from "../components/diary_components/AIChat";

interface Diary {
    diaryId: number;
    userId: number;
    doodleId: number;
    diaryText: string;
    moodColor: string;
    createdAt: string;
    aiCounselingText: string | null;
    chatHistory?: ChatMessage[]; // 과거 대화 기록 (선택적)
}
// React 내부에서 관리할 채팅 메시지 타입
export interface ChatMessage {
    sender: "user" | "ai";
    message: string;
}

interface DiaryViewerProps {
    diaryData: Diary | null;
    type: number;
    date: string;
    setAiResult: (text: string) => void;
}

function Diary() {
    // const today = new Date().toISOString().split("T")[0];
    // console.log(today);
    const location = useLocation();
    const { select_date } = location.state || {};
    console.log(select_date);

    const [date_, setDate_] = useState('');

    const [diary, setDiary] = useState<Diary | null>(null); // DB에 저장된 일기 데이터
    const [messages, setMessages] = useState<ChatMessage[]>([]); // 현재 세션의 채팅 기록
    const [loading, setLoading] = useState(true);
    const [isAiResponding, setIsAiResponding] = useState(false); // AI 응답 대기 상태
    const [type, setType] = useState(1);

    const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);

    const [username, setUsername] = useState(user?.username ?? '');

    const [aiResult, setAiResult] = useState('');

    useEffect(() => {
        if (!select_date || !isAuthenticated) {
            // date가 null, undefined, "" 등 falsy 값이면 실행
            setDiary(null); // 혹은 다른 처리
            setLoading(false);
            setType(1);
            setUsername('');
            return; // axios 호출 종료
        }
        // 오늘 날짜 (YYYY-MM-DD 형식)
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];

        // select_date도 YYYY-MM-DD로 변환
        const selectStr = select_date.toISOString().split("T")[0];

        // 오늘 날짜와 비교해서 type 결정
        if (selectStr === todayStr) {
            setType(1);  // 오늘이면 type = 1
        } else {
            setType(2);  // 오늘이 아니면 type = 2
        }

        setDate_(selectStr);

        setLoading(true);
        setMessages([]); // 날짜가 바뀌면 채팅 기록 초기화

        axiosInstance
            .get<Diary>("/diary", {
                params: { userName: username, date: selectStr }, // userId 예시
            })
            .then((res) => {
                if (res.data) {
                    setDiary(res.data);
                }
            })
            .catch(() => setDiary(null))
            .finally(() => setLoading(false));
    }, [select_date, isAuthenticated, username]);

    // DiaryEditor에서 "저장 및 AI 분석" 완료 시 호출될 함수
    const handleAnalysisComplete = useCallback((result: { diaryId: number; analysisText: string }) => {
        // 새로 생성된 diaryId로 가짜 diary 객체를 만들어 UI를 즉시 업데이트합니다.
        setDiary(prev => ({ ...prev, diaryId: result.diaryId, aiCounselingText: result.analysisText } as Diary));
        // AI의 첫 분석 결과를 메시지 목록에 설정합니다.
        setMessages([{ sender: 'ai', message: result.analysisText }]);
    }, []);

    // AIChat에서 "전송" 버튼 클릭 시 호출될 함수
    const handleNewMessage = useCallback(async (userInput: string) => {
        const userMessage: ChatMessage = { sender: 'user', message: userInput };
        const currentMessages = [...messages, userMessage];
        setMessages(currentMessages);
        setIsAiResponding(true);
        try {
            const res = await axiosInstance.post("/analysis/chat", {
                diaryId: diary?.diaryId,
                message: userInput,
                pastMessages: currentMessages,
            });

            if (res.data && res.data.counselingText) {
                const aiResponse: ChatMessage = { sender: 'ai', message: res.data.counselingText };
                setMessages(prev => [...prev, aiResponse]);
            }
        } catch (err) { console.error("AI 응답 요청 실패:", err); }
        finally { setIsAiResponding(false); }
    }, [diary, messages]);

    if (loading) return <p className="text-center text-gray-500">⏳ 불러오는 중...</p>;

    return (
        <div className="w-full h-full mt-10 flex justify-center">
            <div className="flex flex-wrap justify-center w-full max-w-[1700px] gap-6 px-4">
                {/* 왼쪽 영역 */}
                <div className="flex flex-col min-w-[600px] max-w-[800px] flex-1">
                    {/* --- 수정된 부분 5: DiaryViewer에 명확한 임무(props)만 전달합니다. --- */}
                    <DiaryViewer
                        diaryData={diary}
                        date={date_}
                        type={type}
                        onAnalysisComplete={handleAnalysisComplete}
                    />
                </div>

                {/* 오른쪽 영역 */}
                <div className="min-w-[600px] max-w-[800px] flex-1">
                    {/* diary가 있거나, 새로운 분석 결과(messages)가 있을 때 AIChat을 보여줍니다. */}
                    {diary || messages.length > 0 ? (
                        <AIChat
                            diaryId={diary?.diaryId}
                            messages={messages}
                            isAiLoading={isAiResponding}
                            onSendMessage={handleNewMessage}
                        />
                    ) : (
                        <div className="p-6 border border-gray-200 rounded-2xl shadow-sm bg-white h-full flex items-center justify-center">
                            <p className="text-center text-gray-500">
                                왼쪽에 일기를 작성하고 '저장 및 AI 상담'을 누르면<br /> 대화를 시작할 수 있습니다.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Diary;

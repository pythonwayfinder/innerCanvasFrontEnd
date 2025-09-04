import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"; // Redux 훅 사용
import type { RootState, AppDispatch } from "../../store/store"; // 스토어 타입
import { addMessage, setMessages, setIsAiResponding } from "../../store/diarySlice"; // 액션 생성자
import type { ChatMessage } from "../../store/diarySlice";

import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import axiosInstance from "../../api/axiosInstance";

interface AIChatProps {
    diaryId: number;
    type: number;
    aiResult: string | null;
}

const AIChat: React.FC<AIChatProps> = ({ diaryId, type, aiResult }) => {
    const dispatch: AppDispatch = useDispatch();
    // --- 수정: useState 대신 useSelector로 Redux 스토어의 상태를 가져옵니다. ---
    const { messages, isAiResponding } = useSelector((state: RootState) => state.diary);

    useEffect(() => {
        if (aiResult) {
            // setMessages 대신 dispatch(setMessages(...)) 사용
            dispatch(setMessages([{ sender: 'ai', message: aiResult }]));
        }
    }, [aiResult, dispatch]);

    const refreshMessages = () => {
        // 회원용 메시지 새로고침 로직 (이 부분은 부모 컴포넌트의 역할에 따라 달라질 수 있음)
        // 예: dispatch(fetchMessages(diaryId));
    };

    // --- 수정: 비회원 채팅 핸들러가 Redux 액션을 dispatch 하도록 변경 ---
    const handleGuestMessageSend = async (userInput: string) => {
        const userMessage: ChatMessage = { sender: "user", message: userInput };
        dispatch(addMessage(userMessage)); // 사용자 메시지 추가
        dispatch(setIsAiResponding(true));  // AI 응답 시작 상태로 변경

        // API 요청 시에는 Redux 상태와 관계없이 최신 메시지 목록을 만들어 보냅니다.
        const conversationHistory = [...messages, userMessage].map(msg => ({
            sender: msg.sender,
            message: msg.message
        }));

        try {
            const res = await axiosInstance.post("/analysis/chat", {
                diaryId: diaryId,
                message: userInput,
                pastMessages: conversationHistory
            });

            if (res.data && res.data.counselingText) {
                const aiMessage: ChatMessage = { sender: 'ai', message: res.data.counselingText };
                dispatch(addMessage(aiMessage)); // AI 응답 메시지 추가
            } else {
                throw new Error("AI 응답 형식이 올바르지 않습니다.");
            }
        } catch (err) {
            console.error("AI 응답 요청 실패:", err);
            const errorMessage: ChatMessage = { sender: 'ai', message: "죄송합니다, 답변을 생성하는 데 문제가 발생했습니다." };
            dispatch(addMessage(errorMessage));
        } finally {
            dispatch(setIsAiResponding(false)); // AI 응답 종료 상태로 변경
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-6 border rounded-2xl shadow-sm bg-white h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-[#4D4F94]">💬 AI와 대화하기</h2>

            <div className="flex-grow flex flex-col gap-2 mb-4 p-2 h-96 overflow-y-auto border rounded bg-gray-50">
                {messages.length === 0 && !isAiResponding ? (
                    <div className="flex-grow flex items-center justify-center text-gray-500">
                        AI의 분석 결과를 기다리거나 메시지를 보내보세요.
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <MessageBubble key={index} sender={msg.sender} message={msg.message} />
                    ))
                )}
                {isAiResponding && (
                    <div className="flex justify-start p-2">
                        <div className="bg-gray-200 text-gray-700 rounded-lg p-3 max-w-lg animate-pulse">
                            AI가 답변을 생각하고 있어요...
                        </div>
                    </div>
                )}
            </div>

            <ChatInput
                diaryId={diaryId}
                onSendMessage={diaryId > 0 ? refreshMessages : handleGuestMessageSend}
            />
        </div>
    );
};

export default AIChat;
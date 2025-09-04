import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { addMessage, setMessages, setIsAiResponding } from "../../store/diarySlice";
import type { ChatMessage } from "../../store/diarySlice";

import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput"; // Redux와 연결된 ChatInput을 사용합니다.
import axiosInstance from "../../api/axiosInstance";

interface AIChatProps {
    // diaryId와 type은 이제 Redux 스토어에서 직접 가져오므로 props에서 제거합니다.
    aiResult: string | null;
}

const AIChat: React.FC<AIChatProps> = ({ aiResult }) => {
    const dispatch: AppDispatch = useDispatch();

    // --- FIX 1: 필요한 모든 상태를 Redux 스토어에서 가져옵니다. ---
    const { currentDiary, messages, isAiResponding } = useSelector((state: RootState) => state.diary);

    useEffect(() => {
        if (aiResult) {
            dispatch(setMessages([{ sender: 'ai', message: aiResult }]));
        }
    }, [aiResult, dispatch]);

    // --- FIX 2: 회원/비회원 로직을 통합한 단일 메시지 전송 핸들러 ---
    const handleSendMessage = async (userInput: string) => {
        const userMessage: ChatMessage = { sender: "user", message: userInput };
        dispatch(addMessage(userMessage));
        dispatch(setIsAiResponding(true));

        const conversationHistory = [...messages, userMessage].map(msg => ({
            sender: msg.sender,
            message: msg.message
        }));

        try {
            // currentDiary에서 diaryId를 가져옵니다. 비회원은 -1, 회원은 실제 ID가 됩니다.
            const diaryId = currentDiary?.diaryId ?? -1;

            const res = await axiosInstance.post("/analysis/chat", {
                diaryId: diaryId.toString(),
                message: userInput,
                pastMessages: conversationHistory
            });

            if (res.data && res.data.counselingText) {
                const aiMessage: ChatMessage = { sender: 'ai', message: res.data.counselingText };
                dispatch(addMessage(aiMessage));
            } else {
                throw new Error("AI 응답 형식이 올바르지 않습니다.");
            }
        } catch (err) {
            console.error("AI 응답 요청 실패:", err);
            const errorMessage: ChatMessage = { sender: 'ai', message: "죄송합니다, 답변을 생성하는 데 문제가 발생했습니다." };
            dispatch(addMessage(errorMessage));
        } finally {
            dispatch(setIsAiResponding(false));
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

            {/* --- FIX 3: ChatInput에 통합된 핸들러를 전달합니다. --- */}
            {/* ChatInput은 disabled 상태를 스스로 Redux에서 가져오므로 prop으로 넘길 필요가 없습니다. */}
            <ChatInput
                onSendMessage={handleSendMessage}
            />
        </div>
    );
};

export default AIChat;
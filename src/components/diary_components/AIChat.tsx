import { useEffect, useState } from "react";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import axiosInstance from "../../api/axiosInstance"; // API 호출을 위해 import

// 채팅 메시지의 타입을 정의합니다.
interface ChatMessage {
    sender: "user" | "ai";
    message: string;
}

interface AIChatProps {
    diaryId: number;
    type: number;
    aiResult: string | null; // 최초 분석 결과 (없을 수도 있음)
}

const AIChat: React.FC<AIChatProps> = ({ diaryId, type, aiResult }) => {
    const [updateTrigger, setUpdateTrigger] = useState(0);
    // --- 수정된 부분 1: 모든 메시지를 하나의 상태에서 관리합니다. ---
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isAiResponding, setIsAiResponding] = useState(false); // AI 응답 로딩 상태

    // 최초 분석 결과(aiResult)가 변경될 때마다 메시지 목록을 초기화합니다.
    useEffect(() => {
        if (aiResult) {
            setMessages([{ sender: 'ai', message: aiResult }]);
        }
    }, [aiResult]);

    const refreshMessages = () => {
        setUpdateTrigger((prev) => prev + 1); // 회원용 DB 기반 메시지 목록 새로고침
    };

    // --- 수정된 부분 2: 비회원 채팅을 위한 새로운 핸들러 함수 ---
    const handleGuestMessageSend = async (userInput: string) => {
        // 1. 사용자 메시지를 UI에 즉시 추가하여 빠른 피드백을 줍니다.
        const userMessage: ChatMessage = { sender: "user", message: userInput };
        setMessages(prev => [...prev, userMessage]);
        setIsAiResponding(true);

        try {
            // 2. RAG를 위해 현재까지의 모든 대화 기록을 준비합니다.
            const conversationHistory = [...messages, userMessage].map(msg => ({
                sender: msg.sender,
                message: msg.message
            }));

            // 3. FastAPI 서버로 대화 기록과 새 메시지를 전송합니다.
            const res = await axiosInstance.post("/analysis/chat", {
                message: userInput,        // 사용자의 새로운 질문
                pastMessages: conversationHistory // RAG를 위한 이전 대화 내용
            });

            // 4. AI의 답변을 받아 메시지 목록에 추가합니다.
            if (res.data && res.data.message) {
                const aiMessage: ChatMessage = { sender: 'ai', message: res.data.message };
                setMessages(prev => [...prev, aiMessage]);
            } else {
                throw new Error("AI 응답 형식이 올바르지 않습니다.");
            }

        } catch (err) {
            console.error("AI 응답 요청 실패:", err);
            const errorMessage: ChatMessage = { sender: 'ai', message: "죄송합니다, 답변을 생성하는 데 문제가 발생했습니다." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsAiResponding(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-6 border rounded-2xl shadow-sm bg-white h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-[#4D4F94]">💬 AI와 대화하기</h2>

            {/* --- 수정된 부분 3: 통합된 메시지 목록 UI --- */}
            <div className="flex-grow flex flex-col gap-2 mb-4 p-2 h-96 overflow-y-auto border rounded bg-gray-50">
                {messages.length === 0 ? (
                    <div className="flex-grow flex items-center justify-center text-gray-500">
                        AI의 분석 결과를 기다리거나 메시지를 보내보세요.
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <MessageBubble key={index} sender={msg.sender} message={msg.message} />
                    ))
                )}
                {/* AI가 응답 중일 때 로딩 인디케이터를 표시합니다. */}
                {isAiResponding && (
                    <div className="flex justify-start p-2">
                        <div className="bg-gray-200 text-gray-700 rounded-lg p-3 max-w-lg animate-pulse">
                            AI가 답변을 생각하고 있어요...
                        </div>
                    </div>
                )}
            </div>

            {/* --- 수정된 부분 4: ChatInput에 적절한 핸들러를 전달합니다. --- */}
            <ChatInput
                diaryId={diaryId}
                // diaryId의 유효 여부에 따라 다른 함수를 전달합니다.
                onSendMessage={diaryId > 0 ? refreshMessages : handleGuestMessageSend}
            />
        </div>
    );
};

export default AIChat;
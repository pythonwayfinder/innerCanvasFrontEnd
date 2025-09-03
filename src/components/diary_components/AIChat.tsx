import { useState } from "react";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";

interface Message {
    id: number;
    sender: "user" | "ai";
    text: string;
    timestamp: string;
}

interface MessageListProps {
    diaryId: number;
    type: number;
    aiResult: string;
}

const AIChat: React.FC<MessageListProps> = ({ diaryId, type, aiResult }) => {
    const [updateTrigger, setUpdateTrigger] = useState(0);
    const [tempMessages, setTempMessages] = useState<Message[]>([]); // 임시 채팅 저장

    const refreshMessages = () => {
        setUpdateTrigger((prev) => prev + 1); // DB 연동 시 사용
    };

    const handleTempMessage = (message: Omit<Message, "id" | "timestamp">) => {
        const newMessage: Message = {
            id: Date.now(), // 임시 ID
            timestamp: new Date().toISOString(),
            ...message,
        };
        setTempMessages((prev) => [...prev, newMessage]);
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-4 border rounded shadow bg-white">
            <h2 className="text-2xl font-bold mb-4">💬 AI 상담</h2>

            {/* 🔹 aiResult가 있을 경우 상단에 표시 */}
            {aiResult && (
                <MessageBubble sender={'ai'} message={aiResult}/>
            )}

            {diaryId === -1 ? (
                // 🔹 diaryId가 -1일 때는 임시 메시지만 렌더링
                <div className="flex flex-col gap-2 mb-4">
                    {tempMessages.length === 0 && !aiResult ? (
                        <p className="text-gray-500">아직 메시지가 없습니다.</p>
                    ) : (
                        tempMessages.map((msg) => (
                            <MessageBubble sender={msg.sender} message={msg.text}/>
                        ))
                    )}
                </div>
            ) : (
                // 🔹 diaryId가 -1이 아니면 기존 DB 기반 MessageList 사용
                <MessageList type={type} diaryId={diaryId} />
            )}

            <ChatInput
                diaryId={diaryId}
                onMessageSent={
                    diaryId === -1 ? handleTempMessage : refreshMessages
                }
                aiResult={aiResult}
            />
        </div>
    );
};

export default AIChat;

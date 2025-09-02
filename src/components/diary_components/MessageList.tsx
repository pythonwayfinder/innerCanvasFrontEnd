import { useEffect, useState } from "react";
import MessageBubble from "./MessageBubble.tsx";
import axiosInstance from "../../api/axiosInstance.ts";

interface ChatMessage {
    logId: number;
    diaryId: number;
    sender: "user" | "ai";
    message: string;
    createdAt: string;
}

interface MessageListProps {
    diaryId: number;
    type: number;
}

const MessageList: React.FC<MessageListProps> = ({ diaryId, type }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const fetchMessages = async () => {
        try {
            const res = await axiosInstance.get(`/api/chat?diaryId=${diaryId}`);
            setMessages(res.data); // 배열 형태 [{logId, diaryId, sender, message, createdAt}, ...]
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [diaryId]);

    return (
        <div className="flex flex-col p-2 h-96 overflow-y-auto border rounded bg-gray-50">
            {messages.map((msg) => (
                <MessageBubble key={msg.logId} sender={msg.sender} message={msg.message} />
            ))}
        </div>
    );
};

export default MessageList;

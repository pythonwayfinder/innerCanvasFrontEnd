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

    // const fetchMessages = async () => {
    //     try {
    //         const res = await axiosInstance.get(`/chat?diaryId=${diaryId}`);
    //         setMessages(res.data); // 배열 형태 [{logId, diaryId, sender, message, createdAt}, ...]
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };

    // useEffect(() => {
    //     fetchMessages();
    // }, [diaryId]);
    
    useEffect(() => {
        // 더미 데이터 정의
        const dummyMessages: ChatMessage[] = [
            {
                logId: 1,
                diaryId,
                sender: "user",
                message: "오늘 기분이 좋네요!",
                createdAt: new Date().toISOString(),
            },
            {
                logId: 2,
                diaryId,
                sender: "ai",
                message: "좋은 하루 보내셨군요. 😊",
                createdAt: new Date().toISOString(),
            },
            {
                logId: 3,
                diaryId,
                sender: "user",
                message: "내일 날씨는 어떨까요?",
                createdAt: new Date().toISOString(),
            },
            {
                logId: 4,
                diaryId,
                sender: "ai",
                message: "내일은 맑고 화창할 예정입니다.",
                createdAt: new Date().toISOString(),
            },
        ];

        // 메시지 상태에 바로 세팅
        setMessages(dummyMessages);
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

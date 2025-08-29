import { useState } from "react";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

interface AIChatProps {
    diaryId: number;
}

const AIChat: React.FC<AIChatProps> = ({ diaryId }) => {
    const [updateTrigger, setUpdateTrigger] = useState(0);

    const refreshMessages = () => {
        setUpdateTrigger((prev) => prev + 1); // MessageList에 effect 재실행용
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-4 border rounded shadow bg-white">
            <h2 className="text-2xl font-bold mb-4">💬 AI 상담</h2>
            <MessageList key={updateTrigger} diaryId={diaryId} />
            <ChatInput diaryId={diaryId} onMessageSent={refreshMessages} />
        </div>
    );
};

export default AIChat;

import { useState } from "react";
import axiosInstance from "../../api/axiosInstance.ts";

interface ChatInputProps {
    diaryId: number;
    onMessageSent: (message: { sender: "user" | "ai"; text: string }) => void;
    aiResult: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ diaryId, onMessageSent, aiResult }) => {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {

        if (diaryId == -1) {
            if (!input.trim()) return;

            const newMessage = { sender: "user" as const, text: input.trim() };

            onMessageSent(newMessage);

            setInput("");
        }
        else {
            if (!input.trim()) return;
            setLoading(true);
            try {
                await axiosInstance.post("http://localhost:8080/api/chat", {
                    diaryId,
                    sender: "user",
                    message: input,
                });
                setInput("");
                // onMessageSent();
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

    };

    return (
        <div className="flex gap-2 mt-2">
            <input
                type="text"
                className="flex-1 p-2 border rounded"
                placeholder="메시지를 입력하세요..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={loading}
            />
            <button
                onClick={handleSend}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                disabled={loading || (diaryId == -1 && aiResult == '')}
            >
                {loading ? "전송 중..." : "전송"}
            </button>
        </div>
    );
};

export default ChatInput;

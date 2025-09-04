import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store"; // Redux 스토어의 RootState 타입을 import 합니다.

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    // disabled prop은 이제 Redux 스토어에서 직접 가져오므로 제거합니다.
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
    // --- FIX 1: Redux 스토어에서 AI 응답 상태를 직접 가져옵니다. ---
    const { isAiResponding } = useSelector((state: RootState) => state.diary);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        onSendMessage(input.trim());
        setInput("");
    };

    return (
        <div className="flex gap-2 mt-4">
            <input
                type="text"
                className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A6B1E1] transition"
                placeholder="AI에게 메시지를 보내보세요..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    // --- FIX 2: isAiResponding 상태를 직접 사용합니다. ---
                    if (e.key === "Enter" && !isAiResponding) {
                        handleSend();
                    }
                }}
                disabled={isAiResponding} // disabled 속성에 isAiResponding을 연결합니다.
            />
            <button
                onClick={handleSend}
                className="px-5 py-2.5 bg-[#7286D3] text-white rounded-lg shadow-sm hover:bg-[#5B6CA8] disabled:opacity-50 transition font-semibold"
                disabled={isAiResponding} // disabled 속성에 isAiResponding을 연결합니다.
            >
                {isAiResponding ? "..." : "전송"}
            </button>
        </div>
    );
};

export default ChatInput;
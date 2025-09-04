import { useState } from "react";

// --- 수정된 부분 1: Props 타입을 훨씬 단순하게 변경합니다. ---
interface ChatInputProps {
    // 부모로부터 "메시지를 보내라"는 임무를 수행할 함수를 받습니다.
    onSendMessage: (message: string) => void;
    // 부모로부터 AI가 응답 중인지(로딩 중인지) 상태를 받아옵니다.
    disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
    const [input, setInput] = useState("");

    // --- 수정된 부분 2: handleSend 함수를 하나의 통합된 로직으로 완전히 재작성합니다. ---
    const handleSend = () => {
        // 입력값이 없으면 아무것도 하지 않습니다.
        if (!input.trim()) return;

        // 이제 API를 직접 호출하지 않고, 부모에게 입력된 메시지를 전달하는 신호만 보냅니다.
        onSendMessage(input.trim());

        // 메시지를 보낸 후 입력창을 깨끗하게 비웁니다.
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
                // Enter 키를 눌렀을 때도 전송되도록 합니다.
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !disabled) {
                        handleSend();
                    }
                }}
                // --- 수정된 부분 3: 비활성화 여부를 부모의 상태에 따라 결정합니다. ---
                disabled={disabled}
            />
            <button
                onClick={handleSend}
                className="px-5 py-2.5 bg-[#7286D3] text-white rounded-lg shadow-sm hover:bg-[#5B6CA8] disabled:opacity-50 transition font-semibold"
                disabled={disabled}
            >
                {disabled ? "..." : "전송"}
            </button>
        </div>
    );
};

export default ChatInput;
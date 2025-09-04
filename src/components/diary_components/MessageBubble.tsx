import React from 'react';

interface MessageBubbleProps {
    sender: "user" | "ai";
    message: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ sender, message }) => {
    const isUser = sender === "user";

    return (
        // --- 수정된 부분: 전체적인 정렬과 간격을 조정합니다. ---
        <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                // --- 수정된 부분: 'InnerCanvas' 테마에 맞는 색상과 둥근 모서리를 적용합니다. ---
                className={`px-4 py-2 rounded-xl max-w-[80%] break-words shadow-sm ${
                    isUser
                        ? "bg-[#7286D3] text-white"  // 사용자 메시지 (테마 메인 색상)
                        : "bg-[#E8EAF6] text-gray-800" // AI 메시지 (테마 배경색 계열)
                }`}
            >
                {message}
            </div>
        </div>
    );
};

export default MessageBubble;
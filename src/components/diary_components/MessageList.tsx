import MessageBubble from "./MessageBubble.tsx";

// --- 수정된 부분 1: 부모로부터 받을 props 타입을 명확히 합니다. ---
// 이제 API 호출 로직 없이, 메시지 배열과 AI 로딩 상태만 받습니다.
interface ChatMessage {
    sender: "user" | "ai";
    message: string;
}

interface MessageListProps {
    messages: ChatMessage[];
    isAiLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isAiLoading }) => {

    // --- 수정된 부분 2: 모든 useEffect와 useState를 제거했습니다. ---
    // 이 컴포넌트는 이제 상태를 관리하지 않고, 받은 props를 그리기만 합니다.

    return (
        <div className="flex-grow flex flex-col gap-2 mb-4 p-3 h-96 overflow-y-auto border rounded-lg bg-gray-50">
            {/* 메시지가 없을 때 안내 문구를 보여줍니다. */}
            {messages.length === 0 && !isAiLoading && (
                <div className="flex-grow flex items-center justify-center text-gray-500">
                    <p>AI의 분석 결과를 기다리거나 메시지를 보내보세요.</p>
                </div>
            )}

            {/* 부모로부터 받은 메시지 목록을 순회하며 렌더링합니다. */}
            {messages.map((msg, index) => (
                <MessageBubble key={index} sender={msg.sender} message={msg.message} />
            ))}

            {/* AI가 응답 중일 때 로딩 인디케이터를 표시합니다. */}
            {isAiLoading && (
                <div className="flex justify-start p-2">
                    <div className="bg-gray-200 text-gray-700 rounded-lg p-3 max-w-lg animate-pulse">
                        AI가 답변을 생각하고 있어요...
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessageList;

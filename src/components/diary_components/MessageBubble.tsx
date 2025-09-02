interface MessageBubbleProps {
    sender: "user" | "ai";
    message: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ sender, message }) => {
    const isUser = sender === "user";
    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
            <div
                className={`px-3 py-2 rounded-lg max-w-xs break-words ${isUser ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"
                    }`}
            >
                {message}
            </div>
        </div>
    );
};

export default MessageBubble;

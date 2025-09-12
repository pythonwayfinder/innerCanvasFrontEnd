import React from 'react';
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

// ✅ 부모로부터 받을 props 타입을 정의합니다.
interface AIChatProps {
    onSendMessage: (userInput: string) => void;
}

const AIChat: React.FC<AIChatProps> = ({ onSendMessage }) => {
    // ✅ 필요한 상태는 Redux 스토어에서 직접 가져와 화면에 표시합니다.
    const { messages, isAiResponding } = useSelector((state: RootState) => state.diary);

    // ✅ API 호출 로직(handleSendMessage)과 useEffect는 모두 제거되었습니다.
    //    해당 로직은 부모인 DiaryPage 컴포넌트가 담당합니다.

    return (
        <div className="w-full max-w-3xl mx-auto p-6 border rounded-2xl shadow-sm bg-white h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-[#4D4F94]">💬 AI와 대화하기</h2>

            <div className="flex-grow flex flex-col gap-2 mb-4 p-2 h-96 overflow-y-auto border rounded bg-gray-50">
                {messages.length === 0 && !isAiResponding ? (
                    <div className="flex-grow flex items-center justify-center text-gray-500">
                        AI의 분석 후 대화를 시작할 수 있어요.
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <MessageBubble key={index} sender={msg.sender} message={msg.message} />
                    ))
                )}
                {isAiResponding && (
                    <div className="flex justify-start p-2">
                        <div className="bg-gray-200 text-gray-700 rounded-lg p-3 max-w-lg animate-pulse">
                            AI가 답변을 생각하고 있어요...
                        </div>
                    </div>
                )}
            </div>

            {/* ✅ 부모로부터 받은 onSendMessage 함수를 ChatInput 컴포넌트로 전달합니다. */}
            <ChatInput
                onSendMessage={onSendMessage}
            />
        </div>
    );
};

export default AIChat;
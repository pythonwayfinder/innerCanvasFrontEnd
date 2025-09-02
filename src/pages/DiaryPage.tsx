import { useSelector } from "react-redux";
import DiaryViewer from "../components/diary_components/DiaryViewer";
import MessageList from "../components/diary_components/MessageList";
import type { RootState } from "../store/store";
import { useState } from "react";

function Diary() {
    const today = new Date().toISOString().split("T")[0];

    const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);

    const [username, setUsername] = useState(user?.username ?? '');
    const [email, setEmail] = useState(user?.email ?? '');

    // if (!isAuthenticated || !user) {
    //     return <div className="p-6 text-center text-gray-600">로그인이 필요합니다.</div>;
    // }

    return (
        <div className="w-full h-full mt-10 flex justify-center">
            {/* 좌우 레이아웃 컨테이너 */}
            <div className="flex flex-wrap justify-center w-full max-w-[1700px] gap-6 px-4">
                {/* 왼쪽: DiaryViewer + DiaryEditor */}
                <div className="flex flex-col min-w-[600px] max-w-[800px] flex-1">
                    <DiaryViewer today={today}/>
                </div>

                {/* 오른쪽: MessageList */}
                <div className="min-w-[600px] max-w-[800px] flex-1">
                    <MessageList diaryId={1} />
                </div>
            </div>
        </div>
    );
}

export default Diary;

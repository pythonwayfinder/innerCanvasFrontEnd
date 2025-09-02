import { useSelector } from "react-redux";
import DiaryViewer from "../components/diary_components/DiaryViewer";
import type { RootState } from "../store/store";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import AIChat from "../components/diary_components/AIChat";

interface Diary {
    diaryId: number;
    userId: number;
    doodleId: number;
    diaryText: string;
    moodColor: string;
    createdAt: string;
}

function Diary() {
    // const today = new Date().toISOString().split("T")[0];
    // console.log(today);
    const location = useLocation();
    const { select_date } = location.state || {};
    const [diary, setDiary] = useState<Diary | null>(null);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState(1);

    const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);

    const [username, setUsername] = useState(user?.username ?? '');
    const [email, setEmail] = useState(user?.email ?? '');

    // if (!isAuthenticated || !user) {
    //     return <div className="p-6 text-center text-gray-600">로그인이 필요합니다.</div>;
    // }
    useEffect(() => {
        if (!select_date) {
            // date가 null, undefined, "" 등 falsy 값이면 실행
            setDiary(null); // 혹은 다른 처리
            setLoading(false);
            setType(1);
            return; // axios 호출 종료
        }

        axiosInstance
            .get<Diary>("http://localhost:8080/api/diary", {
                params: { userId: 1, date: select_date }, // userId 예시
            })
            .then((res) => { 
                setDiary(res.data);
                setType(2);
            })
            .catch(() => setDiary(null))
            .finally(() => setLoading(false));        
    }, [select_date]);

    if (loading) return <p className="text-center text-gray-500">⏳ 불러오는 중...</p>;

    return (
        <div className="w-full h-full mt-10 flex justify-center">
            {/* 좌우 레이아웃 컨테이너 */}
            <div className="flex flex-wrap justify-center w-full max-w-[1700px] gap-6 px-4">
                {/* 왼쪽: DiaryViewer + DiaryEditor */}
                <div className="flex flex-col min-w-[600px] max-w-[800px] flex-1">
                    <DiaryViewer diaryData={diary} type={type}/>
                </div>

                {/* 오른쪽: MessageList */}
                <div className="min-w-[600px] max-w-[800px] flex-1">
                    <AIChat diaryId={diary ? diary.diaryId : -1} type={type}/>
                </div>
            </div>
        </div>
    );
}

export default Diary;

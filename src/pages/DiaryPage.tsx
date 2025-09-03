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

interface DiaryViewerProps {
    diaryData: Diary | null;
    type: number;
    date: string;
    setAiResult: (text: string) => void;
}

function Diary() {
    // const today = new Date().toISOString().split("T")[0];
    // console.log(today);
    const location = useLocation();
    const { select_date } = location.state || {};
    console.log(select_date);

    const [date_, setDate_] = useState('');

    const [diary, setDiary] = useState<Diary | null>(null);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState(1);

    const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);

    const [username, setUsername] = useState(user?.username ?? '');

    const [aiResult, setAiResult] = useState('');

    useEffect(() => {
        if (!select_date || !isAuthenticated) {
            // date가 null, undefined, "" 등 falsy 값이면 실행
            setDiary(null); // 혹은 다른 처리
            setLoading(false);
            setType(1);
            setUsername('');
            return; // axios 호출 종료
        }

        // 오늘 날짜 (YYYY-MM-DD 형식)
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];

        // select_date도 YYYY-MM-DD로 변환
        const selectStr = select_date.toISOString().split("T")[0];

        // 오늘 날짜와 비교해서 type 결정
        if (selectStr === todayStr) {
            setType(1);  // 오늘이면 type = 1
        } else {
            setType(2);  // 오늘이 아니면 type = 2
        }

        setDate_(selectStr);

        axiosInstance
            .get<Diary>("/diary", {
                params: { userName: username, date: selectStr }, // userId 예시
            })
            .then((res) => {
                if (res.data) {
                    setDiary(res.data);
                }
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
                    <DiaryViewer diaryData={diary} type={type} date={date_} setAiResult={setAiResult} />
                </div>

                {/* 오른쪽: MessageList */}
                {diary != null || aiResult ? (
                    <div className="min-w-[600px] max-w-[800px] flex-1">
                        <AIChat diaryId={diary ? diary.diaryId : -1} type={type} aiResult={aiResult} />
                    </div>
                ) : 
                    <></>
                }
            </div>
        </div>
    );
}

export default Diary;

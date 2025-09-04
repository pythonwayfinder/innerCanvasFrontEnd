import { useSelector } from "react-redux";
import DiaryViewer from "../components/diary_components/DiaryViewer";
import type { RootState } from "../store/store";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import AIChat from "../components/diary_components/AIChat";
import { getKoreanDateString } from "../utils/dateUtils"; // ✅ 추가

interface Diary {
    diaryId: number;
    userId: number;
    doodleId: number;
    diaryText: string;
    moodColor: string;
    createdAt: string;
    aiCounselingText: string | null;
    chatHistory?: ChatMessage[]; // 과거 대화 기록 (선택적)
}
// React 내부에서 관리할 채팅 메시지 타입
export interface ChatMessage {
    sender: "user" | "ai";
    message: string;
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

    const [diary, setDiary] = useState<Diary | null>(null); // DB에 저장된 일기 데이터
    const [messages, setMessages] = useState<ChatMessage[]>([]); // 현재 세션의 채팅 기록
    const [loading, setLoading] = useState(true);
    const [isAiResponding, setIsAiResponding] = useState(false); // AI 응답 대기 상태
    const [type, setType] = useState(1);

    const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);

    const [username, setUsername] = useState(user?.username ?? '');

    const [aiResult, setAiResult] = useState('');

    useEffect(() => {
        if (!select_date || !isAuthenticated) {
            setDiary(null);
            setLoading(false);
            setType(1);
            setUsername('');
            return;
        }
        // 오늘 날짜 (YYYY-MM-DD 형식)
        const today = new Date();
        const todayStr = getKoreanDateString(today); // ✅ 한국 기준 날짜
        const selectStr = getKoreanDateString(new Date(select_date)); // ✅ 한국 기준 날짜

        // // 1. select_date가 ISO 형식인지 체크
        // console.log("select_date 원본:", select_date);
        // // 2. Date 객체 만들기
        // const d = new Date(select_date);
        // console.log("Date 객체:", d);
        // // 3. 한국 시간 (KST) 기준 시각 확인
        // console.log("KST 시간 (toLocaleString):", d.toLocaleString("ko-KR"));
        // // 4. 한국 기준 날짜만 출력 (YYYY-MM-DD)
        // console.log("한국 날짜 문자열:", getKoreanDateString(d));


        if (selectStr === todayStr) {
            setType(1);
        } else {
            setType(2);
        }

        setDate_(selectStr);

        setLoading(true);
        setMessages([]); // 날짜가 바뀌면 채팅 기록 초기화

        axiosInstance
            .get<Diary>("/diary", {
                params: { username: username, date: selectStr },
            })
            .then((res) => {
                if (res.data) {
                    setDiary(res.data);
                }
            })
            .catch(() => setDiary(null))
            .finally(() => setLoading(false));
    }, [select_date, isAuthenticated, username]);

    if (loading) return <p className="text-center text-gray-500">⏳ 불러오는 중...</p>;

    return (
        <div className="w-full h-full mt-10 flex justify-center">
            {/* 좌우 레이아웃 컨테이너 */}
            <div className="flex flex-wrap justify-center w-full max-w-[1700px] gap-6 px-4">
                {/* 왼쪽: DiaryViewer + DiaryEditor */}
                <div className="flex flex-col min-w-[600px] max-w-[800px] flex-1">
                    <DiaryViewer
                        diaryData={diary}
                        type={type}
                        date={date_}
                        setAiResult={setAiResult}
                    />
                </div>

                {(diary != null || aiResult) && (
                    <div className="min-w-[600px] max-w-[800px] flex-1">
                        <AIChat diaryId={diary ? diary.diaryId : -1} type={type} aiResult={aiResult} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Diary;
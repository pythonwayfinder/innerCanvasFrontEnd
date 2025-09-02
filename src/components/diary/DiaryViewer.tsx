import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInterceptor";

interface Diary {
    diaryId: number;
    userId: number;
    doodleId?: number | null;
    diaryText: string;
    moodColor?: string | null;
    createdAt: string;
}

function DiaryViewer() {
    const { date: paramDate } = useParams<{ date: string }>();
    const [diary, setDiary] = useState<Diary | null>(null);
    const [loading, setLoading] = useState(true);

    const today = new Date().toISOString().split("T")[0];
    const diaryDate = paramDate || localStorage.getItem("selectedDate") || today;

    useEffect(() => {
        localStorage.setItem("selectedDate", diaryDate);

        axiosInstance
            .get<Diary>("http://localhost:8080/api/diary", {
                params: { userId: 1, date: diaryDate }, // userId 예시
            })
            .then((res) => setDiary(res.data))
            .catch((err) => console.error("일기 불러오기 실패:", err))
            .finally(() => setLoading(false));
    }, [diaryDate]);

    if (loading) return <p className="text-center text-gray-500">⏳ 불러오는 중...</p>;
    if (!diary) return <p className="text-center text-red-500">해당 날짜({diaryDate})의 일기를 찾을 수 없습니다.</p>;

    return (
        <div className="p-6 border border-gray-300 rounded-2xl shadow bg-white w-full h-full max-w-3xl mx-auto">
            {/* 제목 및 날짜 */}
            <h2 className="text-2xl font-bold mb-1 text-gray-800">📖 일기</h2>
            <p className="text-sm text-gray-500 mb-2">
                작성일: {new Date(diary.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500 mb-4">
                기분 색: <span className="font-semibold" style={{ color: diary.moodColor || "#000" }}>
                    {diary.moodColor || "없음"}
                </span>
            </p>
            <hr className="mb-4 border-gray-300" />

            {/* 본문 */}
            <div className="space-y-4 text-gray-700 leading-relaxed whitespace-pre-line">
                {diary.diaryText}
            </div>

            {/* Doodle 정보 */}
            {diary.doodleId && (
                <p className="mt-4 text-sm text-gray-500">관련 낙서 ID: {diary.doodleId}</p>
            )}
        </div>
    );
}

export default DiaryViewer;

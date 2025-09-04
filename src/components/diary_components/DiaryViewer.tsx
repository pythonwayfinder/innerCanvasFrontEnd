import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DiaryEditor from "./DiaryEditor.tsx";
import { getKoreanDateString } from "../../utils/dateUtils";
// 홍민우
interface Diary {
    diaryId: number;
    userId: number;
    diaryText: string;
    moodColor?: string | null;
    createdAt: string | "";
}

interface DiaryViewerProps {
    diaryData: Diary | null;
    type: number;
    date: string;
    setAiResult: (text: string) => void;
}

const DiaryViewer: React.FC<DiaryViewerProps> = ({ diaryData, type, date, setAiResult }) => {
    const [diary, setDiary] = useState<Diary | null>(diaryData);
    const [showEditor, setShowEditor] = useState(false);
    const navigate = useNavigate();

    // 오늘 날짜를 한국 시간 기준으로 구함
    const today = getKoreanDateString(new Date());

    // date가 없으면 오늘 날짜 기준으로, 있으면 date 그대로 사용
    const targetDate = date || today;

    // 오늘 날짜인지 판단 (한국 시간 기준)
    const isToday = targetDate === today;

    // diaryData, type 변경 시 diary 상태 관리
    useEffect(() => {
        if (type === 2 && !diaryData) {
            setDiary(diaryData);
        } else {
            setDiary(null);
            return;
        }
    }, [diaryData, type]);


    return (
        <div className="p-6 border border-gray-300 rounded-2xl shadow bg-white w-full h-full max-w-3xl mx-auto">
            {/* 제목 및 날짜 */}
            <h2 className="text-2xl font-bold mb-1 text-gray-800">📖 일기</h2>
            <p className="text-sm text-gray-500 mb-2">
                날짜: {diary ? getKoreanDateString(new Date(diary.createdAt)) : targetDate}
                <button
                    className="ml-2 px-1 py-1 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
                    onClick={() => navigate('/mypage')}
                >
                    달력으로
                </button>
            </p>
            {diary ? (
                // 해당 날짜의 일기가 있을 경우 기분 띄우기
                <p className="text-sm text-gray-500 mb-4">
                    기분 색:{" "}
                    <span
                        className="font-semibold"
                        style={{ color: diary?.moodColor || "#000" }}
                    >
                        {diary?.moodColor || "없음"}
                    </span>
                </p>
            ) : (
                <div></div>
            )}
            <hr className="mb-4 border-gray-300" />

            {/* 본문 */}
            {diary ? (
                <>
                    <div className="space-y-4 text-gray-700 leading-relaxed whitespace-pre-line">
                        {diary.diaryText}
                    </div>

                    {/* Doodle 정보 */}
                    {/* {diary.doodleId && (
                        <p className="mt-4 text-sm text-gray-500">
                            관련 낙서 ID: {diary.doodleId}
                        </p>
                    )} */}
                </>
            ) : (
                <div className="text-center text-gray-500">
                    {!showEditor ? (
                        <>
                            <p className="mb-4">해당 날짜의 일기가 없습니다.</p>
                            <div className="relative inline-block group">
                                <button
                                    onClick={() => isToday && setShowEditor(true)}
                                    disabled={!isToday}
                                    className={`px-4 py-2 rounded-lg shadow transition
                                        ${
                                        isToday
                                            ? "bg-blue-500 text-white hover:bg-blue-600"
                                            : "bg-gray-300 text-gray-600 cursor-not-allowed"
                                    }`}
                                >
                                    ✍️ 일기 작성하기
                                </button>

                                {/* 안내 문구 (오늘 날짜가 아닐 때만 표시) */}
                                {!isToday && (
                                    <div
                                        className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs
                                                rounded px-2 py-1 opacity-0 group-hover:opacity-100
                                                transition-opacity duration-300 whitespace-nowrap z-10"
                                    >
                                        오늘 날짜의 일기만 작성이 가능합니다
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <DiaryEditor setAiResult={setAiResult} />
                    )}
                </div>
            )}
        </div>
    );
};

export default DiaryViewer;
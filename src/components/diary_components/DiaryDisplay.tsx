import type { Diary } from "../../store/diarySlice"; // Redux Slice에서 Diary 타입을 가져옵니다.

interface DiaryDisplayProps {
    diary: Diary;
}

const DiaryDisplay: React.FC<DiaryDisplayProps> = ({ diary }) => {
    // 날짜 형식을 'YYYY년 MM월 DD일'로 예쁘게 변환합니다.
    const formattedDate = new Date(diary.createdAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // ✅ [추가] 색상 코드와 감정 단어를 매칭하는 객체
    const EMOTION_MAP: Record<string, string> = {
        '#fecaca': '분노',
        '#fef08a': '기쁨',
        '#e9d5ff': '상처',
        '#bfdbfe': '불안',
        '#fce7f3': '당황',
        '#d1d5db': '슬픔',
    };

    // ✅ [추가] diary.moodColor 값으로 해당하는 감정 단어를 찾습니다.
    const emotionText = diary.moodColor ? EMOTION_MAP[diary.moodColor] || '' : '';

    return (
        <div className="p-6 border border-gray-200 rounded-2xl shadow-sm bg-white w-full animate-fade-in">
            {/* 헤더: 날짜와 기분 색 */}
            <div className="pb-4 border-b">
                <h2 className="text-2xl font-bold text-[#4D4F94]">📖 {formattedDate}의 일기</h2>
                {diary.moodColor && (
                    <div className="flex items-center mt-2">
                        <p className="text-sm font-semibold text-gray-600 mr-2">오늘의 기분은? </p>
                        <div
                            className="w-6 h-6 rounded-full border border-gray-300"
                            style={{ backgroundColor: diary.moodColor }}
                        ></div>
                        {/* ✅ [수정] 색상 코드 대신 찾은 감정 단어(emotionText)를 표시합니다. */}
                        <p className="ml-2 text-sm font-semibold text-gray-700">{emotionText}</p>
                    </div>
                )}
            </div>

            {/* 본문: 일기 내용 */}
            <div className="mt-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {diary.diaryText}
                </p>
            </div>

            {/* 두들 이미지가 있을 경우 표시 */}
            {diary.doodleUrl && (
                <div className="mt-6">
                    <h3 className="font-bold text-[#4D4F94] mb-2">🎨 오늘의 두들</h3>
                    <div className="border rounded-lg p-2 bg-gray-50">
                        <img
                            src={diary.doodleUrl}
                            alt="사용자가 그린 두들"
                            className="w-full h-auto rounded-md"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiaryDisplay;
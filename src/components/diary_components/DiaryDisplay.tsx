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
                        <p className="ml-2 text-sm font-semibold" style={{ color: diary.moodColor }}>{diary.moodColor}</p>
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

            {/*/!* AI 최초 분석 결과가 있을 경우 표시 *!/*/}
            {/*{diary.aiCounselingText && (*/}
            {/*    <div className="mt-6">*/}
            {/*        <div className="p-4 bg-[#E8EAF6] border border-[#A6B1E1] rounded-lg">*/}
            {/*            <h3 className="font-bold text-[#4D4F94] mb-2">🤖 AI의 최초 분석</h3>*/}
            {/*            <p className="text-gray-700 whitespace-pre-line">{diary.aiCounselingText}</p>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    );
};

export default DiaryDisplay;
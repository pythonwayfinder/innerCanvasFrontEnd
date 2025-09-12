// 각 Hex 코드는 MoodLegend 컴포넌트의 Tailwind CSS 클래스와 일치합니다.
export const EMOTION_COLORS: Record<string, string> = {
    '분노': '#fecaca', // bg-red-200
    '기쁨': '#fef08a', // bg-yellow-200
    '상처': '#e9d5ff', // bg-purple-200
    '불안': '#bfdbfe', // bg-blue-200
    '당황': '#fce7f3', // bg-pink-200
    '슬픔': '#d1d5db', // bg-gray-300
    'default': '#FFFFFF',
};

export const getEmotionColor = (emotion: string): string => {
    return EMOTION_COLORS[emotion] || EMOTION_COLORS['default'];
};


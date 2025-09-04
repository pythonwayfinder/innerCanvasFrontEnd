import React from 'react';

interface Props {
    day: number | null;
    mood: '분노' | '기쁨' | '상처' | '불안' | '당황' | '슬픔' | null;
    onClick: () => void;
    className?: string;
    className2?: string;
}

const moodColors: Record<string, string> = {
    분노: 'bg-red-200',
    기쁨: 'bg-yellow-200',
    상처: 'bg-purple-200',
    불안: 'bg-blue-200',
    당황: 'bg-pink-200',
    슬픔: 'bg-gray-300',
    null: 'bg-white',
};

const CalendarDay: React.FC<Props> = ({ day, mood, onClick, className = '', className2 = '' }) => {
    return (
        <div
            className={`
                h-32 w-full flex flex-col items-center
                justify-between rounded-md
                border ${className2 ? className2 : 'border-gray-300'}
                text-base font-medium
                cursor-pointer p-3
                hover:ring-3 hover:ring-[#a7b4e0] transition
                ${moodColors[mood || 'null']}
            `}
            onClick={onClick}
        >
            <div className={`self-start text-[#3b3b58] ${className}`}>
                {day ?? ''}
            </div>
            {mood && <div className={`w-full h-3 rounded-full mt-auto ${moodColors[mood]}`} />}
        </div>
    );
};

export default CalendarDay;
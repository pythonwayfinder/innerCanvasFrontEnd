import React from 'react';

interface Props {
    day: number | null;
    mood: 'happy' | 'sad' | 'neutral' | 'angry' | null;
    onClick: () => void;
}

const moodColors: Record<string, string> = {
    happy: 'bg-yellow-200',
    sad: 'bg-blue-200',
    angry: 'bg-red-200',
    neutral: 'bg-gray-200',
    null: 'bg-white',
};

const CalendarDay: React.FC<Props> = ({ day, mood, onClick }) => {
    return (
        <div
            className={`h-32 w-full flex flex-col items-center justify-between rounded-md border border-gray-300 text-base font-medium cursor-pointer p-3 hover:ring-2 hover:ring-[#a7b4e0] transition ${moodColors[mood || 'null']}`}
            onClick={onClick}
        >
            <div className="self-start text-[#3b3b58]">{day ?? ''}</div>
            {mood && <div className={`w-full h-3 rounded-full mt-auto ${moodColors[mood]}`} />}
        </div>
    );
};

export default CalendarDay;
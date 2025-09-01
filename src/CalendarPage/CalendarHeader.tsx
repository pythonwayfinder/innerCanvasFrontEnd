import React from 'react';

interface Props {
    date: Date;
    onPrevMonth: () => void;
    onNextMonth: () => void;
}

const CalendarHeader: React.FC<Props> = ({ date, onPrevMonth, onNextMonth }) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return (
        <div className="flex justify-between items-center py-3 px-6 mb-4 bg-[#e8eaf6] rounded-lg shadow">
            <button
                onClick={onPrevMonth}
                className="text-2xl font-bold text-[#5c6bc0] hover:text-[#3949ab] transition"
                aria-label="이전 달"
            >
                &lt;
            </button>
            <span className="text-xl font-semibold text-[#3b3b58]">
                {year}년 {month}월
            </span>
            <button
                onClick={onNextMonth}
                className="text-2xl font-bold text-[#5c6bc0] hover:text-[#3949ab] transition"
                aria-label="다음 달"
            >
                &gt;
            </button>
        </div>
    );
};

export default CalendarHeader;
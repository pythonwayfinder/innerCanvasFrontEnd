import React from 'react';
import CalendarDay from './CalendarDay';

interface Props {
    date: Date;
    moodData: Record<string, 'happy' | 'sad' | 'angry' | 'neutral'>;
    onDateClick: (date: Date) => void;
}

const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];

const CalendarGrid: React.FC<Props> = ({ date, moodData, onDateClick }) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    // 첫 날의 요일 (월=0, ... 일=6 로 맞추기 위해 +6 % 7)
    const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = firstDay + daysInMonth;
    const totalRows = Math.ceil(totalCells / 7);
    const totalSlots = totalRows * 7;

    const calendarCells = Array.from({ length: totalSlots }, (_, i) => {
        const day = i - firstDay + 1;
        return day > 0 && day <= daysInMonth ? day : null;
    });

    return (
        <div>
            <div className="grid grid-cols-7 text-center font-semibold text-[#6b7280] mb-2 select-none">
                {daysOfWeek.map(day => (
                    <div key={day} className="py-2 border-b border-gray-300">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {calendarCells.map((day, idx) => {
                    if (!day) {
                        return <div key={idx} className="h-32 bg-[#f1f3f5] rounded-md" />;
                    }

                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const mood = moodData[dateStr] || null;

                    // 요일 계산 (0=월 ... 5=토, 6=일)
                    const dayOfWeek = idx % 7;
                    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;

                    // 주말이면 날짜 숫자 빨간색
                    const weekendTextClass = isWeekend ? 'text-red-500' : '';

                    return (
                        <CalendarDay
                            key={idx}
                            day={day}
                            mood={mood}
                            onClick={() => onDateClick(new Date(year, month, day))}
                            className={weekendTextClass}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarGrid;
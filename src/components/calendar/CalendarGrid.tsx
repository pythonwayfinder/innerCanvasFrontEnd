import React from 'react';
import CalendarDay from './CalendarDay';

interface Props {
    date: Date;
    moodData: Record<string, 'happy' | 'sad' | 'angry' | 'neutral'>;
    onDateClick: (date: Date) => void;
}

const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

const CalendarGrid: React.FC<Props> = ({ date, moodData, onDateClick }) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();

    // 1일이 시작하는 요일 (일:0 ~ 토:6)
    const firstDay = new Date(year, month, 1).getDay();

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
            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 text-center font-semibold text-[#6b7280] mb-2 select-none">
                {daysOfWeek.map(day => (
                    <div key={day} className="py-2 border-b border-gray-300">
                        {day}
                    </div>
                ))}
            </div>

            {/* 날짜 셀 */}
            <div className="grid grid-cols-7 gap-2">
                {calendarCells.map((day, idx) => {
                    if (!day) {
                        return <div key={idx} className="h-32 bg-[#f1f3f5] rounded-md" />;
                    }

                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const mood = moodData[dateStr] || null;

                    const dayOfWeek = idx % 7;

                    // 🔵 주말 색상 처리
                    const isSunday = dayOfWeek === 0;
                    const isSaturday = dayOfWeek === 6;

                    let weekendTextClass = '';
                    if (isSunday) weekendTextClass = 'text-red-500';
                    else if (isSaturday) weekendTextClass = 'text-blue-500';

                    const isToday =
                        year === todayYear &&
                        month === todayMonth &&
                        day === todayDate;

                    const todayBorderClass = isToday
                        ? 'border-2 border-[#a7b4e0]'
                        : 'border border-gray-300';

                    return (
                        <CalendarDay
                            key={idx}
                            day={day}
                            mood={mood}
                            onClick={() => onDateClick(new Date(year, month, day))}
                            className={weekendTextClass}
                            className2={todayBorderClass}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarGrid;
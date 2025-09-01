import React, { useState } from 'react';
import CalendarHeader from '../components/calendar/CalendarHeader.tsx';
import CalendarGrid from '../components/calendar/CalendarGrid.tsx';
import MoodLegend from '../components/calendar/MoodLegend.tsx';
import { useMoodData } from '../hooks/useMoodData.ts';

const MoodCalendarPage: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    const { moodData, loading, error } = useMoodData(year, month);

    const handlePrevMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const handleDateClick = (date: Date) => {
        alert(`선택한 날짜: ${date.toDateString()}`);
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-[#f9f9fb] rounded-xl shadow-xl min-h-screen flex flex-col">
            <h1 className="text-3xl font-bold text-center text-[#3b3b58] mb-6">
                감정 기록 달력 🗓️
            </h1>

            <CalendarHeader date={currentDate} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} />

            {loading ? (
                <p className="text-center text-gray-500 mt-10">감정 데이터를 불러오는 중입니다...</p>
            ) : error ? (
                <p className="text-center text-red-500 mt-10">오류 발생: {error}</p>
            ) : (
                <CalendarGrid date={currentDate} moodData={moodData} onDateClick={handleDateClick} />
            )}

            <MoodLegend />
        </div>
    );
};

export default MoodCalendarPage;
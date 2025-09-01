import { useState } from 'react';
import CalendarHeader from '../components/calendar/CalendarHeader';
import CalendarGrid from '../components/calendar/CalendarGrid';
import MoodLegend from '../components/calendar/MoodLegend';
import { useMoodData } from '../hooks/useMoodData';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';

export default function MoodCalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const navigate = useNavigate();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    // 로그인한 경우에만 감정 데이터 불러오기
    const { moodData, loading, error } = isAuthenticated
        ? useMoodData(year, month)
        : { moodData: {}, loading: false, error: null };

    const handlePrevMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const handleDateClick = (date: Date) => {
        if (isAuthenticated) {
            alert(`선택한 날짜: ${date.toDateString()}`);
        } else {
            navigate('/login');
        }
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
}
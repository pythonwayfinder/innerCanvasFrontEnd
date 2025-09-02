import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../store/store';
import { useMoodData } from '../../hooks/useMoodData';

import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import MoodLegend from './MoodLegend';

// 이 컴포넌트는 이제 순수한 "달력" 그 자체입니다.
// 겉모습(배경, 그림자 등)은 이 컴포넌트를 사용하는 부모가 결정합니다.
export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const navigate = useNavigate();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

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
            navigate('/diary', { state: {select_date: date}});
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="h-full flex flex-col">
            <h1 className="text-3xl font-bold text-center text-[#3b3b58] mb-6 flex-shrink-0">
                감정 기록 달력 🗓️
            </h1>
            <div className="flex-shrink-0">
                <CalendarHeader date={currentDate} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} />
            </div>
            <div className="flex-grow">
                {loading ? (
                    <p className="text-center text-gray-500 mt-10">감정 데이터를 불러오는 중입니다...</p>
                ) : error ? (
                    <p className="text-center text-red-500 mt-10">오류 발생: {error}</p>
                ) : (
                    <CalendarGrid date={currentDate} moodData={moodData} onDateClick={handleDateClick} className="h-full" />
                )}
            </div>
            <div className="flex-shrink-0">
                <MoodLegend />
            </div>
        </div>
    );
}
import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

type Mood = 'happy' | 'sad' | 'angry' | 'neutral';
type MoodData = Record<string, Mood>; // { "2025-08-10": "happy", ... }

export const useMoodData = (year: number, month: number) => {
    const [moodData, setMoodData] = useState<MoodData>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMoodData = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get(`/mood/${year}/${month}`);

                // 배열을 날짜:감정 형태 객체로 변환
                const moodObj: MoodData = {};
                res.data.forEach((item: { date: string; month: Mood }) => {
                    moodObj[item.date] = item.month;
                });

                setMoodData(moodObj);
            } catch (err: any) {
                console.error('감정 데이터 로딩 실패:', err);
                setError(err.response?.data?.message || '데이터 로딩 실패');
            } finally {
                setLoading(false);
            }
        };

        fetchMoodData();
    }, [year, month]);

    return { moodData, loading, error };
};
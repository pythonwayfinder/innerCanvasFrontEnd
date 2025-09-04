import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { getKoreanDateString } from '../utils/dateUtils';

type Mood = '분노' | '기쁨' | '상처' | '불안' | '당황' | '슬픔';
type MoodData = Record<string, Mood>;

export const useMoodData = (year: number, month: number) => {
    const [moodData, setMoodData] = useState<MoodData>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMoodData = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get(`/mood/${year}/${month}`);

                const moodObj: MoodData = {};
                res.data.forEach((item: { date: string; moodColor: Mood }) => {
                    const dateObj = new Date(item.date);
                    const koreanDateStr = getKoreanDateString(dateObj);
                    moodObj[koreanDateStr] = item.moodColor;
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
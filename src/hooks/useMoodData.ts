import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { getKoreanDateString } from '../utils/dateUtils'; // ✅ 추가

type Mood = 'happy' | 'sad' | 'angry' | 'neutral';
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

                res.data.forEach((item: { date: string; month: Mood }) => {
                    const dateObj = new Date(item.date); // ISO 문자열 → Date 객체
                    const koreanDateStr = getKoreanDateString(dateObj); // ✅ 한국 기준 변환
                    moodObj[koreanDateStr] = item.month;
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
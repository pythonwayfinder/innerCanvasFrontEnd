import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';
import { getKoreanDateString } from '../utils/dateUtils';
import type {RootState} from '../store/store';

// API 응답 데이터의 타입을 명확하게 정의
interface MoodResponseItem {
    date: string;
    moodColor: Mood;
}

// 기존 타입 정의
type Mood = '분노' | '기쁨' | '상처' | '불안' | '당황' | '슬픔';
type MoodData = Record<string, Mood>;

export const useMoodData = (year: number, month: number) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const username = user?.username;

    const [moodData, setMoodData] = useState<MoodData>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!username) {
            setLoading(false);
            return;
        }

        const fetchMoodData = async () => {
            try {
                setLoading(true);
                setError(null);

                // --- 여기를 POST 요청으로 변경 ---
                const requestBody = { username };
                const res = await axiosInstance.post<MoodResponseItem[]>(
                    `/mood/${year}/${month}`,
                    requestBody // 데이터를 요청 본문(body)에 담아 전송
                );

                const moodObj: MoodData = {};
                res.data.forEach((item) => {
                    const dateObj = new Date(item.date);
                    const koreanDateStr = getKoreanDateString(dateObj);
                    moodObj[koreanDateStr] = item.moodColor;
                });

                setMoodData(moodObj);

            } catch (err) {
                console.error('감정 데이터 로딩 실패:', err);
                let errorMessage = '데이터를 불러오는 데 실패했습니다.';
                if (axios.isAxiosError(err)) {
                    errorMessage = err.response?.data?.message || err.message;
                } else if (err instanceof Error) {
                    errorMessage = err.message;
                }
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchMoodData();
    }, [year, month, username]);

    return { moodData, loading, error };
};
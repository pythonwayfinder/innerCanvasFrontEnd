import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

export interface Inquiry {
    id: string;
    title: string;
    content: string;
    answer?: string;
}

interface UseMyInquiriesResult {
    inquiries: Inquiry[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export default function useMyInquiries(): UseMyInquiriesResult {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMyInquiries = async () => {
        return await axiosInstance.get<Inquiry[]>('/inquiries');
    };

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchMyInquiries();
            setInquiries(res.data);
        } catch (err: any) {
            setError(err.message || '문의 목록을 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    return { inquiries, loading, error, refetch: load };
}
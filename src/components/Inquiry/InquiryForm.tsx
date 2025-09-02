import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

interface InquiryFormProps {
    onSuccess?: () => void;
}

export default function InquiryForm({ onSuccess }: InquiryFormProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const submitInquiry = async (data: { title: string; content: string }) => {
        return await axiosInstance.post('/inquiries', data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert('제목과 내용을 입력해주세요.');
            return;
        }

        setLoading(true);
        try {
            await submitInquiry({ title, content });
            alert('문의가 등록되었습니다.');
            setTitle('');
            setContent('');
            onSuccess?.();
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || '문의 등록 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="제목"
                className="border p-2 rounded"
                required
                disabled={loading}
            />
            <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="문의 내용"
                className="border p-2 rounded h-32"
                required
                disabled={loading}
            />

            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onSuccess}
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                    disabled={loading}
                >
                    목록으로 돌아가기
                </button>
                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
                    disabled={loading}
                >
                    {loading ? '제출 중...' : '문의 제출'}
                </button>
            </div>
        </form>
    );
}
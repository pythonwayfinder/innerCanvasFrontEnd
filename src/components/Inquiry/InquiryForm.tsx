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
            {/* --- 수정된 부분: InnerCanvas 테마의 입력창 스타일 적용 --- */}
            <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A6B1E1] transition"
                required
                disabled={loading}
            />
            {/* --- 수정된 부분: InnerCanvas 테마의 텍스트 영역 스타일 적용 --- */}
            <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="문의 내용을 자세히 작성해주세요."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A6B1E1] transition h-40" // 높이를 조금 더 늘렸습니다.
                required
                disabled={loading}
            />

            <div className="flex justify-end gap-3 pt-2">
                {/* --- 수정된 부분: 회색 계열의 2차 액션 버튼 스타일 --- */}
                <button
                    type="button"
                    onClick={onSuccess}
                    className="px-5 py-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-semibold"
                    disabled={loading}
                >
                    목록으로
                </button>
                {/* --- 수정된 부분: 메인 테마 색상의 1차 액션 버튼 스타일 --- */}
                <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#7286D3] text-white rounded-lg shadow-sm hover:bg-[#5B6CA8] disabled:opacity-50 transition font-semibold"
                    disabled={loading}
                >
                    {loading ? '제출 중...' : '문의 제출'}
                </button>
            </div>
        </form>
    );
}
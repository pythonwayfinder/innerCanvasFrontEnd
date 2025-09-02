import React from 'react';
import useMyInquiries from '../../hooks/useMyInquiries';
import type { Inquiry } from '../../api/inquiryApi';

interface InquiryListProps {
    selectedInquiryId: string | null;
    onSelectInquiry: (id: string | null) => void;
}

export default function InquiryList({ selectedInquiryId, onSelectInquiry }: InquiryListProps) {
    const { inquiries, loading, error, refetch } = useMyInquiries();

    // 1. 로딩 중
    if (loading) return <p className="text-center mt-4">로딩 중...</p>;

    // 2. 에러 발생
    if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

    // 3. 문의가 하나도 없을 때
    if (!inquiries.length) {
        return (
            <div className="text-center mt-8 text-gray-500">
                등록된 문의가 없습니다.
            </div>
        );
    }

    // 4. 문의 상세 보기
    if (selectedInquiryId) {
        const inquiry = inquiries.find(i => i.id === selectedInquiryId);
        if (!inquiry) {
            return (
                <p className="text-center mt-4 text-red-500">
                    문의 내용을 찾을 수 없습니다.
                </p>
            );
        }
        return <InquiryDetail inquiry={inquiry} />;
    }

    // 5. 문의 목록 보여주기
    return (
        <div>
            <div className="flex justify-end mb-2">
                <button onClick={refetch} className="text-blue-500 hover:underline">
                    새로고침
                </button>
            </div>
            <ul className="divide-y">
                {inquiries.map((inq) => (
                    <li
                        key={inq.id}
                        className="py-3 cursor-pointer hover:bg-gray-100 px-2 rounded"
                        onClick={() => onSelectInquiry(inq.id)}
                    >
                        <p className="font-bold">{inq.title}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{inq.content}</p>
                        {inq.answer ? (
                            <p className="mt-2 text-green-700">💬 답변 있음</p>
                        ) : (
                            <p className="mt-2 text-gray-500">⏳ 답변 대기 중</p>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function InquiryDetail({ inquiry }: { inquiry: Inquiry }) {
    return (
        <div className="border p-4 rounded bg-gray-50 whitespace-pre-wrap">
            <h2 className="font-bold text-lg mb-2">{inquiry.title}</h2>
            <p className="mb-4">{inquiry.content}</p>
            {inquiry.answer ? (
                <p className="text-green-700">💬 답변: {inquiry.answer}</p>
            ) : (
                <p className="text-gray-500">⏳ 답변 대기 중</p>
            )}
        </div>
    );
}
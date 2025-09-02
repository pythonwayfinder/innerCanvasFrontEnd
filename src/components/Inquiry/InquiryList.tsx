import React from 'react';
import useMyInquiries from '../../hooks/useMyInquiries';

interface InquiryListProps {
    selectedInquiryId: string | null;
    onSelectInquiry: (id: string | null) => void;
}

export default function InquiryList({ selectedInquiryId, onSelectInquiry }: InquiryListProps) {
    const { inquiries, loading, error } = useMyInquiries();

    if (loading) return <p className="text-center mt-4">로딩 중...</p>;
    if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

    if (!inquiries.length) {
        return (
            <div className="text-center mt-8 text-gray-500">
                등록된 문의가 없습니다.
            </div>
        );
    }

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

    return (
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
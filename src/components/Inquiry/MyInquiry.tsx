import React, { useState } from 'react';
import InquiryForm from './InquiryForm';
import InquiryList from './InquiryList';
import useMyInquiries from '../../hooks/useMyInquiries';

export default function MyInquiry() {
    const [showForm, setShowForm] = useState(false);
    const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
    const { refetch } = useMyInquiries(); // ✅ 새로고침 함수 가져옴

    const handleFormSuccess = () => {
        setShowForm(false);
        setSelectedInquiryId(null);
        refetch(); // 문의 등록 후 목록 갱신
    };

    const handleBackToList = () => {
        setSelectedInquiryId(null);
    };

    return (
        <div className="flex flex-col gap-6 p-6 bg-white shadow rounded-lg w-full">
            <h1 className="text-2xl font-bold text-gray-800">문의하기 💬</h1>

            {showForm ? (
                <>
                    <InquiryForm onSuccess={handleFormSuccess} />
                </>
            ) : selectedInquiryId ? (
                <>
                    <InquiryList
                        selectedInquiryId={selectedInquiryId}
                        onSelectInquiry={setSelectedInquiryId}
                    />
                    <div className="flex justify-end mt-4 gap-2">
                        <button
                            onClick={handleBackToList}
                            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                        >
                            목록으로 돌아가기
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <InquiryList
                        selectedInquiryId={null}
                        onSelectInquiry={setSelectedInquiryId}
                    />
                    <div className="flex justify-end mt-4 gap-2">
                        <button
                            onClick={refetch}
                            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                        >
                            새로고침
                        </button>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                        >
                            문의하기
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
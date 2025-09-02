import React, { useState } from 'react';
import InquiryForm from './InquiryForm';
import InquiryList from './InquiryList';

export default function MyInquiry() {
    const [showForm, setShowForm] = useState(false);
    const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);

    const handleFormSuccess = () => {
        setShowForm(false);
        setSelectedInquiryId(null);
    };

    const handleBackToList = () => {
        setSelectedInquiryId(null);
    };

    return (
        <div className="flex flex-col gap-6 p-6 bg-white shadow rounded-lg w-full">
            <h1 className="text-2xl font-bold text-gray-800">문의하기 💬</h1>

            {showForm ? (
                <>
                    <button
                        onClick={handleFormSuccess}
                        className="mb-4 text-blue-500 underline"
                    >
                        목록으로 돌아가기
                    </button>
                    <InquiryForm onSuccess={handleFormSuccess} />
                </>
            ) : selectedInquiryId ? (
                <>
                    <button
                        onClick={handleBackToList}
                        className="mb-4 text-blue-500 underline"
                    >
                        목록으로 돌아가기
                    </button>
                    <InquiryList
                        selectedInquiryId={selectedInquiryId}
                        onSelectInquiry={setSelectedInquiryId}
                    />
                </>
            ) : (
                <>
                    <InquiryList
                        selectedInquiryId={null}
                        onSelectInquiry={setSelectedInquiryId}
                    />
                    <div className="flex justify-end mt-4">
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
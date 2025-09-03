import { useState } from 'react';
import InquiryForm from './InquiryForm';
import InquiryList from './InquiryList';
import useMyInquiries from '../../hooks/useMyInquiries';

export default function MyInquiry() {
    const [showForm, setShowForm] = useState(false);
    const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
    const { refetch } = useMyInquiries();

    const handleFormSuccess = () => {
        setShowForm(false);
        setSelectedInquiryId(null);
        refetch();
    };

    return (
        // --- 수정된 부분 1: 전체 컨테이너 스타일 ---
        <div className="flex flex-col gap-6 p-6 bg-white shadow-md rounded-lg w-full">
            {/* --- 수정된 부분 2: 제목 스타일 --- */}
            <h1 className="text-2xl font-bold text-[#4D4F94]">QnA 💬</h1>

            {showForm ? (
                // 문의 작성 폼 뷰
                <InquiryForm onSuccess={handleFormSuccess} />
            ) : selectedInquiryId ? (
                // 문의 상세 보기 뷰
                <>
                    <InquiryList
                        selectedInquiryId={selectedInquiryId}
                        onSelectInquiry={setSelectedInquiryId}
                    />
                </>
            ) : (
                // 문의 목록 뷰
                <>
                    <InquiryList
                        selectedInquiryId={null}
                        onSelectInquiry={setSelectedInquiryId}
                    />
                    <div className="flex justify-end mt-4 gap-3">
                        {/* --- 수정된 부분 4: '새로고침' 버튼 스타일 --- */}
                        <button
                            onClick={refetch}
                            className="px-5 py-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-semibold"
                        >
                            새로고침
                        </button>
                        {/* --- 수정된 부분 5: '문의하기' 버튼 스타일 --- */}
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-5 py-2.5 bg-[#7286D3] text-white rounded-lg shadow-sm hover:bg-[#5B6CA8] transition font-semibold"
                        >
                            문의하기
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
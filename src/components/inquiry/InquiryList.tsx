import useMyInquiries from '../../hooks/useMyInquiries';
import type { Inquiry } from '../../hooks/useMyInquiries';

interface InquiryListProps {
    selectedInquiryId: string | null;
    onSelectInquiry: (id: string | null) => void;
}

// --- 수정된 부분 1: 상태 표시를 위한 재사용 컴포넌트 ---
const StatusBadge = ({ answer }: { answer: string | null }) => (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
        answer
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
    }`}>
        {answer ? '답변 완료' : '답변 대기중'}
    </span>
);


export default function InquiryList({ selectedInquiryId, onSelectInquiry }: InquiryListProps) {
    const { inquiries, loading, error } = useMyInquiries();

    if (loading) return <p className="text-center mt-4 text-gray-500">문의 내역을 불러오는 중...</p>;
    if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

    if (!inquiries.length) {
        return (
            <div className="text-center mt-8 p-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">등록된 문의가 없습니다.</p>
            </div>
        );
    }

    // --- 수정된 부분 2: 상세 보기 UI가 선택되었을 때의 렌더링 ---
    // InquiryDetail 컴포넌트를 직접 호출하는 대신, 상세 보기에 필요한 UI를 여기에 통합하여
    // 목록으로 돌아가는 버튼을 추가하기 용이하도록 구조를 변경했습니다.
    if (selectedInquiryId) {
        const inquiry = inquiries.find(i => i.id === selectedInquiryId);
        if (!inquiry) {
            return
        }
        return <InquiryDetail inquiry={inquiry} onBackToList={() => onSelectInquiry(null)} />;
    }

    // --- 수정된 부분 3: 문의 목록 UI 스타일 변경 ---

    return (
        <div className="space-y-3">
            {inquiries.map((inq) => (
                <div
                    key={inq.id}
                    className="p-4 border border-gray-200 rounded-lg cursor-pointer transition-all hover:shadow-md hover:border-[#A6B1E1]"
                    onClick={() => onSelectInquiry(inq.id)}
                >
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-[#4D4F94]">{inq.title}</h3>
                        <StatusBadge answer={inq.answer ?? null} />
                    </div>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">{inq.content}</p>
                </div>
            ))}
        </div>
    );
}

// --- 수정된 부분 4: 문의 상세 보기 컴포넌트 스타일 변경 ---
function InquiryDetail({ inquiry, onBackToList }: { inquiry: Inquiry, onBackToList: () => void }) {
    return (
        <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-xl text-[#4D4F94]">{inquiry.title}</h2>
                <StatusBadge answer={inquiry.answer?? null} />
            </div>

            {/* 문의 내용 */}
            <div className="mb-6">
                <p className="text-sm font-semibold text-gray-500 mb-2">문의 내용</p>
                <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap text-gray-700">
                    {inquiry.content}
                </div>
            </div>

            {/* 답변 내용 */}
            <div>
                <p className="text-sm font-semibold text-gray-500 mb-2">관리자 답변</p>
                {inquiry.answer ? (
                    <div className="p-4 bg-indigo-50 rounded-md whitespace-pre-wrap text-[#4D4F94]">
                        {inquiry.answer}
                    </div>
                ) : (
                    <div className="p-4 bg-gray-50 rounded-md text-center text-gray-400">
                        <p>아직 등록된 답변이 없습니다.</p>
                    </div>
                )}
            </div>

            {/* 목록으로 돌아가기 버튼 */}
            <div className="text-center mt-8">
                <button
                    onClick={onBackToList}
                    className="px-5 py-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-semibold"
                >
                    목록으로 돌아가기
                </button>
            </div>
        </div>
    );
}
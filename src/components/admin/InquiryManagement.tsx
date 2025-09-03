import { useEffect, useState } from "react";
// axios 인스턴스를 import하여 백엔드와 통신합니다.
import axiosInstance from "../../api/axiosInstance";

// 백엔드의 InquiryAdminDto와 타입을 맞춥니다.
interface Inquiry {
    id: number;
    username: string;
    title: string;
    content: string;
    answer: string | null;
    status: 'PENDING' | 'ANSWERED';
    createdAt: string;
}

export default function InquiryManagement() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [responseText, setResponseText] = useState("");
    const [error, setError] = useState<string | null>(null);

    // --- 수정된 부분 1: 실제 API를 호출하여 문의 목록을 불러오는 함수 ---
    const fetchInquiries = async () => {
        setLoading(true);
        setError(null);
        try {
            // 관리자용 API 엔드포인트(/api/admin/inquiries)로 GET 요청을 보냅니다.
            const res = await axiosInstance.get<Inquiry[]>('/admin/inquiries');
            setInquiries(res.data);
        } catch (err) {
            setError("문의 내역을 불러오는 데 실패했습니다. 관리자 권한이 있는지 확인해주세요.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트가 처음 렌더링될 때 문의 목록을 불러옵니다.
    useEffect(() => {
        fetchInquiries();
    }, []);

    // 답변하기/내용보기 버튼 클릭 시 모달을 열고 상태를 설정하는 함수
    const handleRespond = (inquiry: Inquiry) => {
        setSelectedInquiry(inquiry);
        setResponseText(inquiry.answer || ""); // 기존 답변이 있으면 불러와서 보여줍니다.
    };

    // --- 수정된 부분 2: 실제 API를 호출하여 답변을 제출하는 함수 ---
    const submitResponse = async () => {
        if (!responseText.trim() || !selectedInquiry) return;

        try {
            // 관리자용 답변 제출 API 엔드포인트로 POST 요청을 보냅니다.
            const res = await axiosInstance.post(`/admin/inquiries/${selectedInquiry.id}/answer`, {
                answer: responseText
            });

            // 답변 제출에 성공하면, 전체 목록을 새로고침하지 않고
            // 로컬 상태만 업데이트하여 화면을 즉시 갱신합니다. (더 나은 UX)
            setInquiries(inquiries.map(inq =>
                inq.id === selectedInquiry.id ? res.data : inq
            ));
            setSelectedInquiry(null); // 모달을 닫습니다.
        } catch (err) {
            alert("답변 제출에 실패했습니다.");
            console.error(err);
        }
    };

    if (loading) return <div className="p-6 text-center">문의 내역을 불러오는 중...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">사용자 문의 관리</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-4 text-left">상태</th>
                        <th className="py-2 px-4 text-left">제목</th>
                        <th className="py-2 px-4 text-left">사용자</th>
                        <th className="py-2 px-4 text-left">문의일시</th>
                        <th className="py-2 px-4 text-left">관리</th>
                    </tr>
                    </thead>
                    <tbody>
                    {inquiries.map((inquiry) => (
                        <tr key={inquiry.id} className="border-b hover:bg-gray-50">
                            <td className="py-2 px-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        inquiry.status === 'PENDING' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
                                    }`}>
                                        {inquiry.status === 'PENDING' ? '대기중' : '답변완료'}
                                    </span>
                            </td>
                            <td className="py-2 px-4 font-medium">{inquiry.title}</td>
                            <td className="py-2 px-4">{inquiry.username}</td>
                            <td className="py-2 px-4 text-sm text-gray-500">{new Date(inquiry.createdAt).toLocaleString()}</td>
                            <td className="py-2 px-4">
                                <button onClick={() => handleRespond(inquiry)} className="text-indigo-600 hover:underline text-sm font-semibold">
                                    {inquiry.status === 'PENDING' ? '답변하기' : '내용보기'}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* 답변 작성 모달 */}
            {selectedInquiry && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={() => setSelectedInquiry(null)}>
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-4">"{selectedInquiry.title}" 문의 답변</h3>
                        <div className="mb-4 p-4 bg-gray-50 rounded-md border">
                            <p className="font-semibold text-gray-700">사용자 문의 내용:</p>
                            <p className="mt-2 text-gray-600">{selectedInquiry.content}</p>
                        </div>
                        <textarea
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            rows={5}
                            className="w-full p-2 border rounded-md"
                            placeholder="답변을 입력하세요..."
                        />
                        <div className="flex justify-end gap-4 mt-4">
                            <button onClick={() => setSelectedInquiry(null)} className="px-4 py-2 bg-gray-200 rounded-md">취소</button>
                            <button onClick={submitResponse} className="px-4 py-2 bg-[#4D4F94] text-white rounded-md">답변 제출</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
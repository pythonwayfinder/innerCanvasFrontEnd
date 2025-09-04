import { useRef, useState } from "react";
import { type ReactSketchCanvasRef } from "react-sketch-canvas";
import axiosInstance from "../../api/axiosInstance.ts";
import DoodleCanvas from "./DoodleCanvas.tsx";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store.ts";

// --- 수정된 부분 1: 부모에게 전달할 데이터 타입을 명확히 정의 ---
interface AnalysisResult {
    diaryId: number;
    analysisText: string;
}
//11111
interface DiaryEditorProps {
    // 이제 부모에게 'diaryId'와 'AI 분석 결과'를 함께 전달합니다.
    onAnalysisComplete: (result: AnalysisResult) => void;
}

const DiaryEditor: React.FC<DiaryEditorProps> = ({ onAnalysisComplete }) => {
    const [diaryText, setDiaryText] = useState("");
    const [moodColor, setMoodColor] = useState("#FFFFFF");

    // --- 수정된 부분 2: 로딩 상태를 하나로 통합합니다. ---
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const canvasRef = useRef<ReactSketchCanvasRef>(null);

    const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);
    const username = user ? user.username : '';

    // --- 수정된 부분 3: '저장'과 'AI상담' 로직을 하나로 합친 핸들러 ---
    const handleSaveAndConsult = async () => {
        if (!diaryText.trim()) {
            setMessage("먼저 일기를 작성해주세요.");
            return;
        }
        if (!isAuthenticated) {
            alert('로그인이 필요한 기능입니다.');
            return;
        }

        setIsLoading(true);
        setMessage("일기를 저장하고 AI 분석을 시작합니다...");

        try {
            // --- 1단계: 일기 텍스트와 기분 색을 먼저 DB에 저장 ---
            const diaryPayload = {
                username: username,
                diaryText,
                moodColor: moodColor || null,
            };
            const diaryRes = await axiosInstance.post("/diary", diaryPayload);
            const savedDiaryId = diaryRes.data.diaryId; // 새로 생성된 diaryId를 받아옵니다.


            if (!savedDiaryId) {
                throw new Error("일기 저장 후 diaryId를 받지 못했습니다.");
            }

            // --- 2단계: 그림이 있으면, 받은 diaryId와 함께 그림을 저장 ---
            const dataUrl = await canvasRef.current?.exportImage("png");
            if (dataUrl) {
                const blob = await (await fetch(dataUrl)).blob();
                const doodleFormData = new FormData();
                doodleFormData.append("file", blob, "doodle.png");
                doodleFormData.append("diaryId", savedDiaryId.toString());
                await axiosInstance.post("/doodles", doodleFormData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            // --- 3단계: 저장된 일기 내용을 바탕으로 AI 분석 요청 ---
            setMessage("저장 완료! AI가 분석 중입니다...");
            const analysisFormData = new FormData();
            analysisFormData.append("diaryText", diaryText);
            if (dataUrl) {
                const blob = await (await fetch(dataUrl)).blob();
                analysisFormData.append("file", blob, "doodle.png");
            }

            const analysisRes = await axiosInstance.post("/analysis/ai", analysisFormData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const analysisText = analysisRes.data.counselingText;

            // --- 4단계: 부모에게 'diaryId'와 'AI 분석 결과'를 함께 전달 ---
            onAnalysisComplete({ diaryId: savedDiaryId, analysisText });

        } catch (err) {
            console.error(err);
            setMessage("❌ 처리 중 오류가 발생했습니다.");
        } finally {
            // 로딩 상태는 부모 컴포넌트가 화면을 전환하며 해제하므로,
            // 여기서는 에러 발생 시에만 풀어주는 것이 좋습니다.
            // setIsLoading(false);
        }
    };

    return (
        <div className="p-6 border border-gray-200 rounded-2xl shadow-sm bg-white w-full max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-[#4D4F94]">✏️ 새 일기 작성</h2>

            <div className="mb-4">
                <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A6B1E1] transition"
                    rows={8}
                    placeholder="오늘 어떤 일이 있었나요? AI에게 솔직한 마음을 이야기해보세요."
                    value={diaryText}
                    onChange={(e) => setDiaryText(e.target.value)}
                    disabled={isLoading} // 처리 중에는 수정 불가
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">오늘의 기분 색 (선택)</label>
                <input
                    type="color" // 색상 선택 UI를 사용하면 더 편리합니다.
                    className="w-full h-10 p-1 border border-gray-300 rounded-md"
                    value={moodColor}
                    onChange={(e) => setMoodColor(e.target.value)}
                    disabled={isLoading}
                />
            </div>

            <DoodleCanvas ref={canvasRef} editable={!isLoading} />

            {message && <p className="mt-4 text-center text-gray-600">{message}</p>}

            {/* --- 수정된 부분 4: 버튼을 하나로 통합 --- */}
            <div className="mt-6">
                <button
                    className="w-full px-4 py-3 bg-[#7286D3] text-white rounded-lg shadow-sm hover:bg-[#5B6CA8] disabled:opacity-50 transition font-semibold text-lg"
                    onClick={handleSaveAndConsult}
                    disabled={isLoading}
                >
                    {isLoading ? "처리 중..." : "저장 및 AI 상담 시작"}
                </button>
            </div>
        </div>
    );
};

export default DiaryEditor;
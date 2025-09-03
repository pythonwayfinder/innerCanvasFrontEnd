import { useRef, useState } from "react";
import { type ReactSketchCanvasRef } from "react-sketch-canvas";
import axiosInstance from "../../api/axiosInstance.ts";
import DoodleCanvas from "./DoodleCanvas.tsx";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store.ts";

interface DiaryInput {
    username: string;
    diaryText: string;
    moodColor?: string | null;
}

interface DiaryEditorProps {
    setAiResult: (text: string) => void;
}

const DiaryEditor: React.FC<DiaryEditorProps> = ({ setAiResult }) => {
    const [diaryText, setDiaryText] = useState("");
    const [moodColor, setMoodColor] = useState("#FFFFFF");
    const [doodleId, setDoodleId] = useState<number | undefined>();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const canvasRef = useRef<ReactSketchCanvasRef>(null);

    const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);

    const username = user ? user.username : '';

    // const [aiResult, setAiResult] = useState<string>(""); // AI 분석 결과
    const [canSave, setCanSave] = useState(false);       // 일기 저장 버튼 활성화
    const [loadingAi, setLoadingAi] = useState(false);   // AI 분석 중 로딩
    const [isLocked, setIsLocked] = useState(false); // 상담 후 잠금

    const handleSubmit = async () => {
        setLoading(true);
        setMessage("");

        if (!isAuthenticated) {
            alert('로그인 중이 아닙니다');
            return;
        }

        try {
            // 1️⃣ 다이어리 먼저 저장
            const diaryPayload: DiaryInput = {
                username: username,
                diaryText,
                moodColor: moodColor || null,
            };

            const diaryRes = await axiosInstance.post("http://localhost:8080/api/diary", diaryPayload);
            const savedDiaryId = diaryRes.data.diaryId; // 서버에서 반환한 diaryId

            // 2️⃣ 그림 저장 (있으면)
            const dataUrl = await canvasRef.current?.exportImage("png");
            if (dataUrl) {
                const blob = await (await fetch(dataUrl)).blob();
                const formData = new FormData();
                formData.append("file", blob, "doodle.png");
                formData.append("diaryId", savedDiaryId.toString()); // 다이어리 ID 매칭

                await axiosInstance.post("http://localhost:8080/api/doodles", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            // 3️⃣ 상태 초기화
            setMessage("✅ 일기 작성 완료!");
            setDiaryText("");
            setMoodColor("");
            setDoodleId(undefined);
            canvasRef.current?.clearCanvas();
        } catch (err) {
            console.error(err);
            setMessage("❌ 일기 작성 실패");
        } finally {
            setLoading(false);
        }
    };

    const handleAiConsult = async () => {
        // if (!isAuthenticated) {
        //     alert('로그인 중이 아닙니다');
        //     return;
        // }

        setLoadingAi(true);
        setMessage("");

        try {
            const dataUrl = await canvasRef.current?.exportImage("png");
            const formData = new FormData();
            // formData.append("username", username);
            formData.append("diaryText", diaryText);
            // formData.append("moodColor", moodColor || "");
            if (dataUrl) {
                const blob = await (await fetch(dataUrl)).blob();
                formData.append("file", blob, "doodle.png");
            }

            // 스프링 통합 엔드포인트 호출
            const res = await axiosInstance.post("/analysis/ai", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const aiText = res.data.counselingText; // FastAPI에서 받은 분석 결과
            console.log(aiText);
            setAiResult(aiText);
            setMessage("💡 AI 상담 완료!");
            setCanSave(true); // 상담 완료 후 일기 저장 버튼 활성화
            setIsLocked(true); // 상담 완료 후 수정 불가
        } catch (err) {
            console.error(err);
            setMessage("❌ AI 상담 실패");
        } finally {
            setLoadingAi(false);
        }
    };

    return (
        <div className="p-6 border border-gray-300 rounded-2xl shadow bg-white w-full max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">✏️ 새 일기 작성</h2>

            <div className="mb-4">
                <textarea
                    className="w-full p-2 border rounded"
                    rows={6}
                    placeholder="오늘의 일기를 작성하세요"
                    value={diaryText}
                    onChange={(e) => setDiaryText(e.target.value)}
                    disabled={isLocked}
                />
            </div>

            <div className="mb-4 flex gap-4">
                <input
                    type="text"
                    className="border p-2 rounded flex-1"
                    placeholder="기분 색 (예: #FFEEAA)"
                    value={moodColor}
                    onChange={(e) => setMoodColor(e.target.value)}
                    disabled={true}
                />
            </div>

            <DoodleCanvas ref={canvasRef} doodleId={doodleId} editable={!isLocked} />

            <button
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                onClick={handleAiConsult}
                disabled={canSave || loadingAi}
            >
                {loading ? "상담 중..." : "상담하기"}
            </button>

            <button
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                onClick={handleSubmit}
                disabled={!canSave || loading}
            >
                {loading ? "저장 중..." : "일기 저장"}
            </button>

            {message && <p className="mt-4 text-gray-700">{message}</p>}
        </div>
    );
}

export default DiaryEditor;

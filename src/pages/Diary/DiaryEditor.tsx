import axios from "axios";
import { useRef, useState } from "react";
import { ReactSketchCanvas, type ReactSketchCanvasRef } from "react-sketch-canvas";

interface DiaryInput {
    userId: number;
    doodleId?: number | null;
    diaryText: string;
    moodColor?: string | null;
}

function DiaryEditor() {
    const [diaryText, setDiaryText] = useState("");
    const [moodColor, setMoodColor] = useState("");
    const [doodleId, setDoodleId] = useState<number | undefined>();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const canvasRef = useRef<ReactSketchCanvasRef>(null);

    // 그림 저장 → 서버 업로드 → doodleId 세팅
    const handleSaveDrawing = async () => {
        try {
            const dataUrl = await canvasRef.current?.exportImage("png"); // Promise<string>
            if (!dataUrl) {
                setMessage("❌ 그림 데이터가 없습니다.");
                return;
            }
            const blob = await (await fetch(dataUrl)).blob();
            const formData = new FormData();
            formData.append("file", blob, "doodle.png");
            formData.append("userId", "1"); // 로그인 사용자 ID (예시)

            const res = await axios.post("http://localhost:8080/api/doodles", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setDoodleId(res.data.doodleId);
            setMessage("🖼️ 그림 저장 완료!");
        } catch (err) {
            console.error(err);
            setMessage("❌ 그림 저장 실패");
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setMessage("");

        const payload: DiaryInput = {
            userId: 1, // 예시: 로그인 유저 ID
            diaryText,
            moodColor: moodColor || null,
            doodleId: doodleId || null,
        };

        try {
            const res = await axios.post("http://localhost:8080/api/diary", payload);
            setMessage("✅ 일기 작성 완료!");
            setDiaryText("");
            setMoodColor("");
            setDoodleId(undefined);
        } catch (err) {
            console.error(err);
            setMessage("❌ 일기 작성 실패");
        } finally {
            setLoading(false);
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
                />
            </div>

            <div className="mb-4 flex gap-4">
                <input
                    type="text"
                    className="border p-2 rounded flex-1"
                    placeholder="기분 색 (예: #FFEEAA)"
                    value={moodColor}
                    onChange={(e) => setMoodColor(e.target.value)}
                />
            </div>

            <button
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? "저장 중..." : "일기 저장"}
            </button>

            {message && <p className="mt-4 text-gray-700">{message}</p>}
        </div>
    );
}

export default DiaryEditor;

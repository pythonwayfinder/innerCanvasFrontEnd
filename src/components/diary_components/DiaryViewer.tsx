import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type ReactSketchCanvasRef } from "react-sketch-canvas";
import type { RootState, AppDispatch } from "../../store/store";
import { setCurrentDiary, setMessages, fetchDiaryByDate } from "../../store/diarySlice";
import axiosInstance from "../../api/axiosInstance";

import DoodleCanvas from "./DoodleCanvas";
import DiaryDisplay from "./DiaryDisplay"; // 일기 내용을 보여줄 순수 UI 컴포넌트

interface DiaryViewerProps {
    selectedDate: Date;
}

const DiaryViewer: React.FC<DiaryViewerProps> = ({ selectedDate }) => {
    const dispatch: AppDispatch = useDispatch();
    const { currentDiary, status } = useSelector((state: RootState) => state.diary);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    // --- DiaryEditor의 상태와 로직을 이곳으로 통합 ---
    const [diaryText, setDiaryText] = useState("");
    const [moodColor, setMoodColor] = useState("#FFFFFF");
    const [isLoading, setIsLoading] = useState(false);
    const canvasRef = useRef<ReactSketchCanvasRef>(null);

    // 날짜가 바뀔 때마다 해당 날짜의 일기를 불러옵니다.
    useEffect(() => {
        if(isAuthenticated) {
            const dateStr = selectedDate.toISOString().split('T')[0];
            dispatch(fetchDiaryByDate(dateStr));
        }
    }, [selectedDate, isAuthenticated, dispatch]);

    // "저장 및 AI 분석" 핸들러
    const handleSaveAndConsult = async () => {
        if (!diaryText.trim()) return;
        setIsLoading(true);
        try {
            const diaryRes = await axiosInstance.post('/diary', { diaryText, moodColor });
            const savedDiary = diaryRes.data;

            const dataUrl = await canvasRef.current?.exportImage("png");
            if (dataUrl) {
                const blob = await (await fetch(dataUrl)).blob();
                const doodleFormData = new FormData();
                doodleFormData.append('file', blob, 'doodle.png');
                doodleFormData.append('diaryId', savedDiary.diaryId.toString());
                await axiosInstance.post('/doodles', doodleFormData);
            }

            const analysisFormData = new FormData();
            analysisFormData.append('diaryText', diaryText);
            if (dataUrl) { /* ... */ }
            const analysisRes = await axiosInstance.post('/analysis/ai', analysisFormData);

            const finalDiaryData = { ...savedDiary, aiCounselingText: analysisRes.data.counselingText };
            dispatch(setCurrentDiary(finalDiaryData)); // Redux에 최종 일기 저장
            dispatch(setMessages([{ sender: 'ai', message: analysisRes.data.counselingText }]));
        } catch (err) { console.error(err); }
        finally { setIsLoading(false); }
    };

    if (status === 'loading') return <div className="p-6 text-center">⏳ 일기를 불러오는 중...</div>;

    return (
        <div className="p-6 border border-gray-200 rounded-2xl shadow-sm bg-white w-full">
            {currentDiary ? (
                // --- 일기가 있으면: DiaryDisplay 렌더링 ---
                <DiaryDisplay diary={currentDiary} />
            ) : (
                // --- 일기가 없으면: DiaryEditor UI 렌더링 ---
                <div>
                    <h2 className="text-2xl font-bold mb-4 text-[#4D4F94]">✏️ {selectedDate.toISOString().split('T')[0]}의 새 일기</h2>
                    <textarea value={diaryText} onChange={(e) => setDiaryText(e.target.value)} rows={8} className="w-full p-2 border rounded" placeholder="오늘의 이야기를 들려주세요..."/>
                    <input type="color" value={moodColor} onChange={(e) => setMoodColor(e.target.value)} className="w-full h-10 mt-2" />
                    <DoodleCanvas ref={canvasRef} />
                    <button onClick={handleSaveAndConsult} disabled={isLoading} className="mt-4 w-full bg-[#7286D3] text-white p-3 rounded-lg font-semibold">
                        {isLoading ? "처리 중..." : "저장 및 AI 분석"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default DiaryViewer;
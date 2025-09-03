import { forwardRef, useState } from "react";
import { ReactSketchCanvas, type ReactSketchCanvasRef } from "react-sketch-canvas";

interface DoodleCanvasProps {
    doodleId?: number;
    editable?: boolean;
}

const DoodleCanvas = forwardRef<ReactSketchCanvasRef, DoodleCanvasProps>(
    ({ doodleId, editable }, ref) => {
        const [color, setColor] = useState("#000000");
        const [strokeWidth, setStrokeWidth] = useState(3);
        const [isEraser, setIsEraser] = useState(false);

        return (
            <div className="mb-4">
                <h3 className="font-semibold mb-2 text-lg">🖌 그림 그리기</h3>

                {/* 도구 바 */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                    {/* 색상 선택 */}
                    <label className="flex items-center gap-1">
                        색상:
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-10 h-8 p-0 border border-gray-300 rounded"
                        />
                    </label>

                    {/* 선 굵기 */}
                    <label className="flex items-center gap-1">
                        굵기:
                        <input
                            type="range"
                            min={1}
                            max={20}
                            value={strokeWidth}
                            onChange={(e) => setStrokeWidth(Number(e.target.value))}
                            className="w-24"
                        />
                        {strokeWidth}px
                    </label>

                    {/* 지우개 */}
                    <button
                        className={`px-3 py-1 rounded ${
                            isEraser ? "bg-red-500 text-white" : "bg-gray-200"
                        }`}
                        onClick={() => {
                            setIsEraser(!isEraser);
                            if (ref && (ref as any).current) {
                                (ref as any).current.eraseMode(!isEraser);
                            }
                        }}
                    >
                        {isEraser ? "그리기 모드" : "지우개 모드"}
                    </button>

                    {/* Undo / Redo */}
                    <button
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        onClick={() => ref && (ref as any).current?.undo()}
                    >
                        되돌리기
                    </button>
                    <button
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        onClick={() => ref && (ref as any).current?.redo()}
                    >
                        다시하기
                    </button>

                    {/* 초기화 */}
                    <button
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                        onClick={() => ref && (ref as any).current?.clearCanvas()}
                    >
                        초기화
                    </button>
                </div>

                {/* 캔버스 */}
                <ReactSketchCanvas
                    ref={ref}
                    width="100%"
                    height="300px"
                    strokeWidth={strokeWidth}
                    strokeColor={color}
                    style={{ border: "1px solid #ccc", borderRadius: "8px" }}
                    allowOnlyPointerType={!editable ? "none" : "all"}
                />

                {/* 연결된 DoodleId */}
                {doodleId && (
                    <p className="mt-2 text-sm text-gray-600">
                        연결된 doodleId: {doodleId}
                    </p>
                )}
            </div>
        );
    }
);

export default DoodleCanvas;

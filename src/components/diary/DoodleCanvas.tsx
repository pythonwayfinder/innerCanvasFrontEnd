import { forwardRef } from "react";
import { ReactSketchCanvas, type ReactSketchCanvasRef } from "react-sketch-canvas";

interface DoodleCanvasProps {
    doodleId?: number;
}

const DoodleCanvas = forwardRef<ReactSketchCanvasRef, DoodleCanvasProps>(({ doodleId }, ref) => {
    return (
        <div className="mb-4">
            <h3 className="font-semibold mb-2">그림 그리기</h3>
            <ReactSketchCanvas
                ref={ref}
                style={{ border: "1px solid #ccc", borderRadius: "8px" }}
                width="100%"
                height="300px"
                strokeWidth={3}
                strokeColor="black"
            />
            <div className="flex gap-2 mt-2">
                <button
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                    onClick={() => ref && (ref as any).current?.clearCanvas()}
                >
                    초기화
                </button>
            </div>
            {doodleId && (
                <p className="mt-2 text-sm text-gray-600">연결된 doodleId: {doodleId}</p>
            )}
        </div>
    );
});

export default DoodleCanvas;

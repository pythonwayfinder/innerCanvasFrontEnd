// src/ErrorBoundary.tsx

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트 합니다.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // 에러 리포팅 서비스에 에러를 기록할 수도 있습니다.
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            // 직접 커스텀 폴백 UI를 렌더링할 수 있습니다.
            return (
                <div>
                    <h1>문제가 발생했습니다.</h1>
                    <p>앱 렌더링 중 에러가 발생했습니다. 새로고침하거나 개발자 콘솔을 확인해주세요.</p>
                    <pre style={{ whiteSpace: 'pre-wrap', color: 'red' }}>
            {this.state.error?.toString()}
          </pre>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
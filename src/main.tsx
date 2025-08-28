// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // react-router-dom에서 BrowserRouter를 가져옵니다.

import App from './App.tsx';
import { AppProviders } from './AppProviders.tsx';
import ErrorBoundary from './ErrorBoundary.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ErrorBoundary>
            {/* 👇 최상위에서 단 한 번만 BrowserRouter를 사용합니다. */}
            <BrowserRouter>
                <AppProviders>
                    <App />
                </AppProviders>
            </BrowserRouter>
        </ErrorBoundary>
    </React.StrictMode>
);
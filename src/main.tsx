// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'; // 👈 react-redux에서 Provider를 가져옵니다.

import App from './App.tsx';
import { AppProviders } from './AppProviders.tsx';
import ErrorBoundary from './ErrorBoundary.tsx';
import { store } from './store/store.ts'; // 👈 우리가 만든 스토어를 가져옵니다.
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        {/* 👇 Provider로 앱 전체를 감싸고, store를 props로 전달합니다. */}
        <Provider store={store}>
            <ErrorBoundary>
                <BrowserRouter>
                    <AppProviders>
                        <App />
                    </AppProviders>
                </BrowserRouter>
            </ErrorBoundary>
        </Provider>
    </React.StrictMode>
);
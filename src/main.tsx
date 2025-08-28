import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'

import App from './App'
import { AppProviders } from './AppProviders'
import ErrorBoundary from './ErrorBoundary'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ErrorBoundary>
            <Provider store={store}>
                <BrowserRouter>
                    <AppProviders>
                        <App />
                    </AppProviders>
                </BrowserRouter>
            </Provider>
        </ErrorBoundary>
    </React.StrictMode>,
)

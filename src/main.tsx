import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import React from 'react'
import {AppProviders} from "./AppProviders.tsx";

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <AppProviders>
    <App />
      </AppProviders>
  </React.StrictMode>,
)

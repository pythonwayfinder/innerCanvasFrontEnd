// src/app/AppProviders.tsx
// src/app/AppProviders.tsx
import type {ReactNode} from 'react'
import { BrowserRouter } from 'react-router-dom'


export function AppProviders({ children }: { children: ReactNode }) {


    return (
        <BrowserRouter>
                <AppProviders>
                    {children}
                </AppProviders>
        </BrowserRouter>
    )
}

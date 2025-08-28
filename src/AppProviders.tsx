// src/AppProviders.tsx

import React from 'react';

// 예시: 나중에 다른 Provider들 (QueryClientProvider, ThemeProvider 등)이 이곳에 추가될 수 있습니다.
export const AppProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        // <QueryClientProvider client={queryClient}>
        //   <ThemeProvider theme={theme}>
        <>{children}</>
        //   </ThemeProvider>
        // </Query-ClientProvider>
    );
};
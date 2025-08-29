// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.ts';

export const store = configureStore({
    reducer: {
        auth: authReducer, // 'auth'라는 이름으로 authReducer를 등록
        // 나중에 다른 Slice가 생기면 여기에 추가합니다. (예: post: postReducer)
    },
});

// RootState와 AppDispatch 타입을 정의하여 타입스크립트에서 편하게 사용
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
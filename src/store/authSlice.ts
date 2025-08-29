// src/store/authSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface User {
    username: string;
    email: string;
    role: string;
    age?: number; // 필요하면 주석 해제
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    accessToken: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    accessToken: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart(state) {
            state.loading = true;
            state.error = null;
        },
        loginSuccess(state, action: PayloadAction<{ user: User; accessToken: string }>) {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.loading = false;
            // LoginPage에서 localStorage.setItem을 이미 하므로 여기선 생략
        },
        loginFailure(state, action: PayloadAction<string>) {
            state.isAuthenticated = false;
            state.user = null;
            state.accessToken = null;
            state.loading = false;
            state.error = action.payload;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.accessToken = null;
            localStorage.removeItem('accessToken');
        },
        setAuth(state, action: PayloadAction<{ user: User; accessToken: string }>) {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
        },
        clearAuth(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.accessToken = null;
            localStorage.removeItem('accessToken');
        },
        // ✅ MyPage에서 즉시 화면 반영용(서버 저장은 추후)
        updateProfile(state, action: PayloadAction<Partial<User>>) {
            if (!state.user) return;
            state.user = { ...state.user, ...action.payload };
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    setAuth,
    clearAuth,
    updateProfile,
} = authSlice.actions;

export default authSlice.reducer;

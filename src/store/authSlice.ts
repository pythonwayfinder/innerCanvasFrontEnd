import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface User {
    username: string;
    email: string;
    role: string;
    age?: number;        // 서버에서 계산된 나이
    birthDate?: string;  // YYYY-MM-DD
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

// src/store/authSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// 사용자 정보 타입 정의
interface User {
    username: string;
    email: string;
    role: string;
}

// 이 Slice가 관리할 상태(State)의 타입 정의
interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    accessToken: string | null;
    loading: boolean;
    error: string | null;
}

// 초기 상태
const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    accessToken: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth', // 이 Slice의 이름
    initialState,
    reducers: {
        // 로그인 요청이 시작될 때 호출될 리듀서
        loginStart(state) {
            state.loading = true;
            state.error = null;
        },
        // 로그인 성공 시 호출될 리듀서
        loginSuccess(state, action: PayloadAction<{ user: User; accessToken: string }>) {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.loading = false;
        },
        // 로그인 실패 시 호출될 리듀서
        loginFailure(state, action: PayloadAction<string>) {
            state.isAuthenticated = false;
            state.user = null;
            state.accessToken = null;
            state.loading = false;
            state.error = action.payload;
        },
        // 로그아웃 시 호출될 리듀서
        logout(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.accessToken = null;
            localStorage.removeItem('accessToken'); // 로그아웃 시 로컬스토리지도 정리
        },
        // ✨ 추가: 앱 로드 시 인증 상태를 설정하는 리듀서
        setAuth(state, action: PayloadAction<{ user: User; accessToken: string }>) {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
        },
        // ✨ 추가: 토큰 검증 실패 또는 로그아웃 시 상태를 초기화하는 리듀서
        clearAuth(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.accessToken = null;
            localStorage.removeItem('accessToken');
        }
    },
});

// 다른 파일에서 사용할 수 있도록 액션(Action)들을 export
export const { loginStart, loginSuccess, loginFailure, logout, setAuth, clearAuth } = authSlice.actions;

// 스토어(Store)에서 사용할 수 있도록 리듀서(Reducer)를 export
export default authSlice.reducer;
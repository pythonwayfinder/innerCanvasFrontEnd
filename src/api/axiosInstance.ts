// src/api/axiosInstance.ts
import axios, { type AxiosError } from 'axios';
import { store } from '../store/store';
import { logout } from '../store/authSlice';

// 1. 요청/응답 인터셉터가 있는 메인 인스턴스
const axiosInstance = axios.create({
    baseURL: '/api',
});

// 2. ✨ 인터셉터가 없는 "깨끗한" axios 인스턴스 (토큰 재발급 전용)
const axiosForRefresh = axios.create({
    baseURL: '/api',
});


// 요청 인터셉터 (변경 없음)
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터 (로직 재구성)
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // ❗️ 이전의 혼란스러웠던 if 문을 삭제했습니다.

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // ✨ 토큰 재발급 시에는 인터셉터가 없는 axiosForRefresh를 사용합니다.
                const res = await axiosForRefresh.post('/auth/reissue');
                const { accessToken } = res.data;

                localStorage.setItem('accessToken', accessToken);
                originalRequest.headers['Authorization'] = accessToken;

                return axiosInstance(originalRequest);

            } catch (refreshError) {
                // 👇 이제 재발급 실패는 "무조건" 이 catch 블록으로 들어옵니다.
                console.error("토큰 재발급 최종 실패. 전체 로그아웃 절차를 실행합니다.");

                try {
                    // 1. 백엔드 로그아웃 API 호출
                    await axiosForRefresh.post('/auth/logout');
                } catch (logoutError) {
                    console.error("서버 측 로그아웃 요청 실패:", logoutError);
                } finally {
                    // 2. 프론트엔드 상태 정리 및 리디렉션
                    store.dispatch(logout());
                    alert("세션이 만료되어 자동으로 로그아웃되었습니다. 다시 로그인해주세요.");
                    window.location.href = '/login';
                }

                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { store } from '../store'; // 👈 1. store를 직접 import
import { logout } from '../slices/authSlice'; // 👈 2. logout 액션을 import

const axiosInstance = axios.create({
    baseURL: '/api', // '/api'로 시작하는 요청을 기본으로 설정
});

// -------------------------------------------------------------------
// 1. 요청 인터셉터 (기존 코드)
//    모든 요청을 보내기 전에 토큰을 헤더에 추가합니다.
// -------------------------------------------------------------------
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


// -------------------------------------------------------------------
// ✨ 2. 응답 인터셉터 (새로 추가된 핵심 로직)
//    API 응답을 받은 후 에러를 처리합니다.
// -------------------------------------------------------------------
axiosInstance.interceptors.response.use(
    // (1) 성공적인 응답은 그대로 통과시킵니다.
    (response) => {
        return response;
    },
    // (2) 에러가 발생한 응답을 처리합니다.
    async (error: AxiosError) => {
        // a. `error.config`는 원래 요청에 대한 설정 정보입니다.
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // b. 401 에러이고, 재시도한 요청이 아닐 경우에만 토큰 재발급 로직을 실행합니다.
        //    `originalRequest._retry`는 재시도를 막기 위한 플래그입니다.
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true; // 재시도 플래그를 true로 설정

            try {
                // c. 토큰 재발급 API를 호출합니다. (Refresh Token은 쿠키에 담겨 자동으로 전송됨)
                const response = await axiosInstance.post('/auth/reissue');
                const { accessToken } = response.data;

                // d. 새로 받은 Access Token을 로컬 스토리지에 저장합니다.
                localStorage.setItem('accessToken', accessToken);

                // e. 원래 요청의 헤더에 새로운 Access Token을 설정합니다.
                axiosInstance.defaults.headers.common['Authorization'] = accessToken;
                if(originalRequest.headers) {
                    originalRequest.headers['Authorization'] = accessToken;
                }

                // f. 실패했던 원래 요청을 새로운 토큰으로 다시 시도합니다.
                return axiosInstance(originalRequest);

            } catch (refreshError) {
                console.error("토큰 재발급 실패:", refreshError);

                try {
                    // 1. 백엔드의 로그아웃 API를 호출하여 서버 측 상태(Redis, 쿠키)를 정리합니다.
                    //    이때는 인터셉터를 타지 않는 순수 axios를 사용하거나, 새 인스턴스를 사용하는 것이 안전합니다.
                    //    여기서는 기존 인스턴스를 사용하되, 에러 처리를 명확히 합니다.
                    await axiosInstance.post('/auth/logout');
                    console.log("서버 측 로그아웃(Redis, 쿠키 정리) 요청 성공");
                } catch (logoutError) {
                    console.error("서버 측 로그아웃 요청 실패:", logoutError);
                } finally {
                    // 2. 서버 응답과 상관없이 프론트엔드의 상태를 모두 초기화합니다.
                    store.dispatch(logout());
                    localStorage.removeItem('accessToken');
                    // 3. 사용자에게 문제를 알리고 로그인 페이지로 리디렉션합니다.
                    alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }
        // 401 에러가 아니거나, 다른 종류의 에러는 그대로 실패 처리합니다.
        return Promise.reject(error);
    }
);

export default axiosInstance;
// src/App.tsx
import {Routes, Route, Outlet, Navigate} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage'; // 👈 회원가입 페이지 import
import { setAuth, clearAuth } from './store/authSlice';
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import type {AppDispatch, RootState} from "./store/store.ts";
import axiosInstance from "./api/axiosInstance.ts";
import Header from "./components/Header.tsx";
import OAuthCallback from "./pages/OAuthCallback.tsx";
import MyPage from "./pages/MyPage.tsx";
import MainPage from "./pages/MainPage.tsx";
import DiaryPage from "./pages/DiaryPage.tsx";
import MoodCalendarPage from "./pages/MoodCalendarPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";

// 임시 컴포넌트들 (실제 페이지로 교체될 예정)
const MyPageContent = () => <div className="p-8"><h2>마이 페이지 내용</h2><p>여기는 로그인한 사용자만 볼 수 있는 마이 페이지입니다.</p></div>;
const AboutPage = () => <div className="p-8"><h2>서비스 소개</h2><p>WayFinderAI 서비스에 오신 것을 환영합니다!</p></div>;



// 비공개 라우트 (로그인 필요)
const PrivateRoutes = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    // 로그인되어 있지 않으면 로그인 페이지로 리다이렉트
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        const checkAuthStatus = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                try {
                    // ✨ App 컴포넌트에서 직접 API를 호출합니다.
                    const response = await axiosInstance.get('/auth/me');
                    // 성공 시, 서버로부터 받은 사용자 정보로 Redux 상태를 업데이트합니다.
                    dispatch(setAuth({ user: response.data, accessToken }));
                } catch (error) {
                    // 토큰이 유효하지 않은 경우(401 에러 등), 상태를 깨끗하게 초기화합니다.
                    console.error("토큰 검증 실패:", error);
                    dispatch(clearAuth());
                }
            }
        };
        checkAuthStatus();
    }, [dispatch]);


    return (
        <>
            {/* 모든 페이지 상단에 Header를 고정 */}
            <Header />
            <Routes>
                {/* 공개 라우트 */}
                <Route path="/" element={<MainPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} /> {/* 회원가입 페이지 추가 */}
                <Route path="/signup/oauth" element={<SignupPage />} /> {/* 👈 OAuth 전용 경로 추가 */}
                <Route path="/oauth/callback" element={<OAuthCallback />} /> {/* 👈 콜백 경로 추가 */}
                <Route path="/calendar" element={<MoodCalendarPage />} />
                <Route path="/diary" element={<DiaryPage />} />

                {/* 비공개 라우트 (로그인 필요) */}
                <Route element={<PrivateRoutes />}>
                    <Route path="/mypage" element={<MyPage />} /> {/* MyPage는 PrivateRoutes 안에 있어야 함 */}
                    <Route path="/dashboard" element={<MyPageContent />} /> {/* 예시로 추가 */}
                    <Route path="/adminpage" element={<AdminPage />} />
                </Route>

                {/* 존재하지 않는 경로 처리 */}
                <Route path="*" element={<div className="p-8 text-center"><h1>404 Not Found</h1><p>페이지를 찾을 수 없습니다.</p></div>} />
            </Routes>
        </>
    );
}

export default App;
// src/App.tsx
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store/store';

import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage.tsx';

const MainPage = () => <div className="p-8">메인 페이지</div>;
const AboutPage = () => <div className="p-8">서비스 소개</div>;

const PrivateRoutes = () => {
    const { isAuthenticated } = useSelector((s: RootState) => s.auth);
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default function App() {
    return (
        <>
            <Header />
            <Routes>
                {/* 공개 */}
                <Route path="/" element={<MainPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* 비공개 */}
                <Route element={<PrivateRoutes />}>
                    <Route path="/mypage" element={<MyPage />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<div className="p-8 text-center"><h1>404 Not Found</h1></div>} />
            </Routes>
        </>
    );
}

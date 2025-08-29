// src/components/Header.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { logout } from '../store/authSlice';
import axiosInstance from '../api/axiosInstance';

const Header = () => {
    const dispatch: AppDispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate(); // 페이지 이동을 위한 훅

    const handleLogout = async () => {
        try {
            await axiosInstance.post('/auth/logout');
        } catch (error) {
            console.error("로그아웃 요청 실패:", error);
        } finally {
            dispatch(logout());
            navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
        }
    };

    return (
        <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold hover:text-blue-200">
                InnerCanvas AI
            </Link>
            <nav>
                {isAuthenticated ? (
                    <div className="flex items-center space-x-4">
                        <span className="text-lg">환영합니다, <span className="font-semibold">{user?.username}</span>님!</span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                            로그아웃
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center space-x-4">
                        {/* 현재 로그인 페이지가 아니라면 로그인 링크를 보여줍니다. */}
                        <Link to="/login" className="px-4 py-2 border border-white rounded hover:bg-blue-500 transition-colors">
                            로그인
                        </Link>
                        <Link to="/signup" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                            회원가입
                        </Link>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
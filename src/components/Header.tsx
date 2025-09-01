// src/components/Header.tsx
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import type {AppDispatch, RootState} from '../store/store';
import {logout} from '../store/authSlice';
import axiosInstance from '../api/axiosInstance';
import logo from '../assets/logo.png';

const Header = () => {
    const dispatch: AppDispatch = useDispatch();
    const {isAuthenticated, user} = useSelector((s: RootState) => s.auth);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axiosInstance.post('/auth/logout');
            dispatch(logout());
            navigate('/login', {replace: true});
        } catch {
        }
    };

    return (
        <header className="bg-[#E8EAF6] p-4 shadow-sm flex justify-between items-center border-b-2 border-[#A6B1E1] border-dashed">
            <Link to="/" className="flex items-center">
        <span className="text-2xl font-bold text-[#4D4F94] hover:text-[#7286D3] transition-colors">
            Inner Canvas
        </span>
                <img src={logo} alt="Inner Canvas Logo" className="h-10 w-10 ml-1 mb-2" />
            </Link>
            {/* 가운데 섹션: 주 메뉴 (달력, 일기장) */}
            <div className="flex-1 flex justify-center items-center space-x-6 text-slate-700 font-bold">
                <Link
                    to="/calendar"
                    className="px-3 py-2 rounded-md hover:bg-[#D4DAF7] hover:text-[#5B6CA8] transition-colors"
                >
                    달력
                </Link>
                {/* 일기장 메뉴는 로그인 시에만 중앙에 보이도록 처리 */}
                {isAuthenticated && (
                    <Link to="/diary" className="px-3 py-2 rounded-md hover:bg-[#D4DAF7] hover:text-[#5B6CA8] transition-colors">
                        일기장
                    </Link>
                )}
            </div>
            <nav>
                {isAuthenticated ? (
                    <div className="flex items-center space-x-4 text-slate-700 font-bold">
                        <Link to="/mypage" className="px-3 py-2 rounded-md hover:bg-[#D4DAF7] hover:text-[#5B6CA8] transition-colors">
                            마이페이지
                        </Link>
                        <span className="text-lg">
                    환영합니다, <span className="text-[#8C7ED4]">{user?.username}</span>님!
                </span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-rose-200 text-rose-800 rounded-md hover:bg-rose-300 transition-colors font-bold"
                        >
                            로그아웃
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center space-x-4 font-bold">
                        <Link to="/login" className="px-4 py-2 border border-[#8EA7E9] text-[#7286D3] rounded-md hover:bg-[#D4DAF7] transition-colors">
                            로그인
                        </Link>
                        <Link to="/signup" className="px-4 py-2 bg-[#7286D3] text-white rounded-md hover:bg-[#5B6CA8] transition-colors">
                            회원가입
                        </Link>

                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;

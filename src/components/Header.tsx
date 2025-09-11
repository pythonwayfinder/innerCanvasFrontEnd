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
        } catch (err) {
            console.log(err)
        }
    };

    return (
        <header
            className="relative bg-[#E8EAF6] p-4 shadow-sm flex justify-between items-center border-b-2 border-[#A6B1E1] border-dashed">
            {/* 왼쪽 섹션: 로고 */}
            <div className="flex-shrink-0">
                <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-[#4D4F94] hover:text-[#7286D3] transition-colors">
                Inner Canvas
            </span>
                    <img src={logo} alt="Inner Canvas Logo" className="h-10 w-10 ml-1 mb-2"/>
                </Link>
            </div>

            {/* 가운데 섹션: 주 메뉴 (절대 위치로 중앙 정렬) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">                
                {!(isAuthenticated && user?.role === "ADMIN") ? (
                    <Link
                        to="/diary"
                        className="inline-block px-4 py-2 rounded-md text-center text-2xl font-bold text-slate-700 transition-colors hover:text-slate-500"
                    >
                        AI 상담
                    </Link>
                ) : (
                    <></>
                )
                }
            </div>

            {/* 오른쪽 섹션: 사용자 메뉴 */}
            <nav className="flex-shrink-0">
                {isAuthenticated ? (
                    <div className="flex items-center space-x-4 text-slate-700 font-bold">
                        {user?.role === "ADMIN" ? (
                            <Link to="/adminpage"
                                  className="px-3 py-2 rounded-md hover:bg-[#D4DAF7] hover:text-[#5B6CA8] transition-colors">
                                관리자페이지
                            </Link>
                        ) : (
                            <Link to="/mypage"
                                  className="px-3 py-2 rounded-md hover:bg-[#D4DAF7] hover:text-[#5B6CA8] transition-colors">
                                마이페이지
                            </Link>
                        )}
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
                        <Link to="/login"
                              className="px-4 py-2 border border-[#8EA7E9] text-[#7286D3] rounded-md hover:bg-[#D4DAF7] transition-colors">
                            로그인
                        </Link>
                        <Link to="/signup"
                              className="px-4 py-2 bg-[#7286D3] text-white rounded-md hover:bg-[#5B6CA8] transition-colors">
                            회원가입
                        </Link>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;

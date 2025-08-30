import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';

import type { AppDispatch, RootState } from '../store/store';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import axiosInstance from '../api/axiosInstance';

const LoginPage = () => {
    // 1. 컴포넌트 내부에서만 사용할 상태 (Local State)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // 2. Redux 스토어와 통신하기 위한 도구들
    const dispatch: AppDispatch = useDispatch();
    const { isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);

    const navigate = useNavigate(); // 페이지 이동을 위한 훅

    // ✨ 로그인 성공 시 메인 페이지로 리다이렉트 (App.tsx에서 처리하는게 더 일반적)
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/'); // 로그인 성공하면 메인 페이지로 이동
        }
    }, [isAuthenticated, navigate]);


    // 3. 로그인 버튼 클릭 시 실행될 이벤트 핸들러
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginStart()); // Redux에 "로그인 시작"을 알림
        try {
            // axios를 사용한 API 요청
            const response = await axiosInstance.post('/auth/login', { username, password });
            // 🔄 response.data에서 accessToken과 user를 함께 구조 분해 할당합니다.
            const { accessToken, user } = response.data;

            localStorage.setItem('accessToken', accessToken);
            // ✅ 서버로부터 받은 실제 user 객체를 Redux에 전달합니다.
            dispatch(loginSuccess({ user, accessToken }));


        } catch (err: any) {
            const errorMessage = err.response?.data?.message || '로그인에 실패했습니다.';
            dispatch(loginFailure(errorMessage)); // Redux에 "로그인 실패"를 알림
        }
    };

    // const handleLogout = async () => {
    //     try {
    //         // ✨ 1. 백엔드에 로그아웃 API를 호출합니다.
    //         //    이 요청으로 서버의 Redis 토큰이 삭제되고, 브라우저의 쿠키가 만료됩니다.
    //         await axiosInstance.post('/auth/logout');
    //
    //     } catch (error) {
    //         console.error("로그아웃 요청 실패:", error);
    //     } finally {
    //         // ✨ 2. API 호출 성공 여부와 관계없이 프론트엔드의 상태를 정리합니다.
    //         //    이렇게 하면 네트워크가 불안정해도 사용자 입장에서는 즉시 로그아웃된 것처럼 보입니다.
    //         dispatch(logout());
    //     }
    // };
    //
    // // 5. 조건부 렌더링: 로그인 상태에 따라 다른 UI를 보여줌
    // if (isAuthenticated) {
    //     return (
    //         <div className="p-8">
    //             <h1 className="text-2xl font-bold">환영합니다, {user?.username}님!</h1>
    //             <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
    //                 로그아웃
    //             </button>
    //         </div>
    //     );
    // }

    // 6. 로그인 폼 UI (JSX)
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8]"> {/* 제일 연한 보라: 배경 */}
            <div className="p-8 max-w-md w-full bg-white rounded-2xl shadow-lg">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-[#7286D3]">Inner Canvas 로그인</h2> {/* 진한 파랑: 메인 제목 */}
                    <p className="text-slate-500 mt-2">로그인하여 내면의 캔버스를 채워보세요</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-slate-600 text-sm font-bold mb-2" htmlFor="username">
                            아이디
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="block w-full px-4 py-3 bg-[#FFFFFF] border border-[#B3C5F1] rounded-md text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8EA7E9] focus:border-transparent transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 text-sm font-bold mb-2" htmlFor="password">
                            비밀번호
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full px-4 py-3 bg-[#FFFFFF] border border-[#B3C5F1] rounded-md text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8EA7E9] focus:border-transparent transition-colors"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#7286D3] hover:bg-[#5B6CA8] text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline disabled:bg-[#CDC1FF] transition-all duration-300"
                        >
                            {loading ? '로그인 중...' : '로그인'}
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#E5D9F2]"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-slate-500">
                                또는 소셜 계정으로 계속하기
                            </span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <a href="/oauth2/authorization/google"
                           className="w-full flex items-center justify-center px-4 py-3 border border-[#E5D9F2] rounded-md shadow-sm text-sm font-medium text-[#7286D3] bg-white hover:bg-gray-100 transition-colors">
                            <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
                                <path fill="#4285F4" d="M24 9.5c3.23 0 5.93 1.13 8.07 3.19l6.3-6.3C34.91 2.82 29.88 0 24 0 14.52 0 6.46 5.8 2.8 13.71l7.85 6.07C12.33 13.03 17.7 9.5 24 9.5z"></path>
                                <path fill="#34A853" d="M46.2 24.51c0-1.61-.14-3.18-.42-4.71H24v8.99h12.44c-.54 2.92-2.19 5.42-4.71 7.12l7.85 6.07C43.08 38.1 46.2 31.88 46.2 24.51z"></path>
                                <path fill="#FBBC05" d="M11.65 28.14c-.6-1.8-1.04-3.71-1.04-5.64s.44-3.84 1.04-5.64l-7.85-6.07C1.13 14.52 0 19.12 0 24s1.13 9.48 3.8 13.21l7.85-6.07z"></path>
                                <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.79l-7.85-6.07c-2.13 1.44-4.87 2.3-7.04 2.3-6.3 0-11.67-3.53-13.35-8.36l-7.85 6.07C6.46 42.2 14.52 48 24 48z"></path>
                                <path fill="none" d="M0 0h48v48H0z"></path>
                            </svg>
                            <span>Google 계정으로 로그인</span>
                        </a>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <p className="text-sm text-slate-500">
                        아직 회원이 아니신가요?{' '}
                        <Link to="/signup" className="font-medium text-[#7286D3] hover:text-[#8EA7E9]">
                            회원가입
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
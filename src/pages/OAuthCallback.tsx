// src/pages/OAuthCallback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axiosInstance from '../api/axiosInstance';
import { loginSuccess } from '../store/authSlice';
import type { AppDispatch } from '../store/store';

const OAuthCallback = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const handleLoginSuccess = async () => {
            try {
                // 1단계: /reissue API를 호출하여 AccessToken을 먼저 받습니다.
                const reissueResponse = await axiosInstance.post('/auth/reissue');
                const { accessToken } = reissueResponse.data;

                // 2단계: 받은 AccessToken을 즉시 localStorage에 저장합니다.
                localStorage.setItem('accessToken', accessToken);

                // 3단계: /me API를 호출하여 사용자 정보를 가져옵니다.
                // (axiosInstance가 다음 요청부터 자동으로 새 토큰을 헤더에 담아줍니다.)
                const meResponse = await axiosInstance.get('/auth/me');
                const user = meResponse.data;

                // 4단계: AccessToken과 사용자 정보를 모두 받은 후 Redux 상태를 업데이트합니다.
                dispatch(loginSuccess({ user, accessToken }));

                // 5단계: 성공 후 메인 페이지로 이동합니다.
                navigate('/');

            } catch (error) {
                console.error("로그인 처리 실패:", error);
                navigate('/login');
            }
        };

        handleLoginSuccess();
    }, [dispatch, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-xl">로그인 처리 중입니다...</p>
        </div>
    );
};

export default OAuthCallback;
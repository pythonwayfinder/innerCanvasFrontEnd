import { useState, useEffect } from 'react';
import { useNavigate, useLocation} from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export const useSignupForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [birthDate, setBirthDate] = useState('');

    const [isOAuthFlow, setIsOAuthFlow] = useState(false);

    const [usernameStatus, setUsernameStatus] = useState<'unchecked' | 'checking' | 'available' | 'taken'>('unchecked');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const location = useLocation(); // 현재 URL 경로 정보를 가져오는 훅
    const navigate = useNavigate();
    useEffect(() => {
        // ✨ URL 경로가 '/signup/oauth'이면, OAuth 가입 흐름으로 판단합니다.
        if (location.pathname === '/signup/oauth') {
            setIsOAuthFlow(true);
            // ❗️ 이메일을 어떻게 가져올 것인가?
            // 이메일은 이제 서버 세션에만 있으므로, 프론트에서는 알 수 없습니다.
            // 대신, 아이디/생년월일만 입력받고 서버가 세션의 이메일과 조합하도록 합니다.
        }
    }, [location.pathname]);

    const handleUsernameCheck = async () => {
        if (!username) {
            alert('아이디를 입력해주세요.');
            return;
        }
        setUsernameStatus('checking');
        try {
            const response = await axiosInstance.get(`/auth/check-username?username=${username}`);
            if (response.data) {
                setUsernameStatus('available');
            } else {
                setUsernameStatus('taken');
            }
        } catch (err) {
            setError('중복 확인 중 에러가 발생했습니다.');
            setUsernameStatus('unchecked');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (usernameStatus !== 'available') {
            alert('아이디 중복 확인을 해주세요.');
            return;
        }
        if (!isOAuthFlow && password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (isOAuthFlow) {
                // ❌ tempToken 대신, username, birthDate만 보냅니다.
                await axiosInstance.post('/auth/oauth-signup', { username, birthDate });
                alert('회원가입이 완료되었습니다! 로그인 해주세요.');
                navigate('/login');
            } else {
                await axiosInstance.post('/auth/signup', { username, password, email, birthDate });
                alert('회원가입에 성공했습니다! 로그인 페이지로 이동합니다.');
                navigate('/login');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || '회원가입에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return {
        username, setUsername,
        email, setEmail,
        password, setPassword,
        confirmPassword, setConfirmPassword,
        birthDate, setBirthDate,
        isOAuthFlow,
        usernameStatus, setUsernameStatus,
        error,
        loading,
        handleUsernameCheck,
        handleSubmit,
    };
};
import { Link } from 'react-router-dom';
import { useSignupForm } from '../hooks/useSignupForm';

const SignupPage = () => {
    const {
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
    } = useSignupForm();

    const getUsernameFeedback = () => {
        switch (usernameStatus) {
            case 'checking': return <p className="text-sm text-yellow-500 mt-1">확인 중...</p>;
            case 'available': return <p className="text-sm text-green-500 mt-1">사용 가능한 아이디입니다.</p>;
            case 'taken': return <p className="text-sm text-red-500 mt-1">이미 사용 중인 아이디입니다.</p>;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
            <div className="p-8 max-w-md w-full bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">
                    {isOAuthFlow ? '추가 정보 입력' : '회원가입'}
                </h2>
                {isOAuthFlow && <p className="text-center text-gray-600 mb-4">Inner Canvas에서 사용할 아이디를 입력해주세요.</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">아이디</label>
                        <div className="flex space-x-2">
                            <input
                                id="username" type="text" value={username}
                                onChange={(e) => { setUsername(e.target.value); setUsernameStatus('unchecked'); }}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                                required
                            />
                            <button type="button" onClick={handleUsernameCheck} className="px-3 py-2 bg-gray-200 text-sm rounded hover:bg-gray-300 flex-shrink-0">중복 확인</button>
                        </div>
                        {getUsernameFeedback()}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">이메일</label>
                        <input
                            id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                            disabled={isOAuthFlow}
                            required
                        />
                    </div>

                    {/* ✨ OAuth 가입 흐름이 아닐 때만 이메일과 비밀번호 입력창을 보여줍니다. */}
                    {!isOAuthFlow && (
                        <>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">이메일</label>
                                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" required />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">비밀번호</label>
                                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" required />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">비밀번호 확인</label>
                                <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" required />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="birthDate">생년월일</label>
                        <input id="birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" required />
                    </div>

                    {error && <p className="text-red-500 text-xs italic">{error}</p>}

                    <div className="flex flex-col items-center pt-4">
                        <button
                            type="submit" disabled={loading || usernameStatus !== 'available'}
                            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
                        >
                            {loading ? '처리 중...' : '가입 완료'}
                        </button>
                        {!isOAuthFlow && (
                            <Link to="/login" className="mt-4 text-sm text-blue-500 hover:text-blue-800">
                                이미 계정이 있으신가요? 로그인
                            </Link>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
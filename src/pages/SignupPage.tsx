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
        <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] py-12">
            <div className="p-8 max-w-md w-full bg-white rounded-2xl shadow-lg">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-700">
                        {isOAuthFlow ? '추가 정보 입력' : 'Inner Canvas 회원가입'}
                    </h2>
                    <p className="text-slate-500 mt-2">
                        {isOAuthFlow ? '서비스 이용을 위해 추가 정보를 입력해주세요.' : '내면의 캔버스를 채울 준비가 되셨나요?'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-600 text-sm font-bold mb-2" htmlFor="username">아이디</label>
                        <div className="flex space-x-2">
                            <input
                                id="username" type="text" value={username}
                                onChange={(e) => { setUsername(e.target.value); setUsernameStatus('unchecked'); }}
                                className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#A7D8B8] focus:border-transparent transition-colors"
                                required
                            />
                            <button type="button" onClick={handleUsernameCheck} className="px-3 py-2 bg-slate-200 text-sm rounded-md hover:bg-slate-300 flex-shrink-0 transition-colors">중복 확인</button>
                        </div>
                        {getUsernameFeedback()}
                    </div>

                    {!isOAuthFlow && (
                        <>
                            <div>
                                <label className="block text-slate-600 text-sm font-bold mb-2" htmlFor="email">이메일</label>
                                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#A7D8B8] focus:border-transparent transition-colors" required />
                            </div>
                            <div>
                                <label className="block text-slate-600 text-sm font-bold mb-2" htmlFor="password">비밀번호</label>
                                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#A7D8B8] focus:border-transparent transition-colors" required />
                            </div>
                            <div>
                                <label className="block text-slate-600 text-sm font-bold mb-2" htmlFor="confirmPassword">비밀번호 확인</label>
                                <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#A7D8B8] focus:border-transparent transition-colors" required />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-slate-600 text-sm font-bold mb-2" htmlFor="birthDate">생년월일</label>
                        <input id="birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#A7D8B8] focus:border-transparent transition-colors" required />
                    </div>

                    {error && <p className="text-red-500 text-xs text-center">{error}</p>}

                    <div className="flex flex-col items-center pt-4">
                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-[#639473] hover:bg-[#527A60] text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline disabled:bg-[#DAD3CA] transition-all duration-300"
                        >
                            {loading ? '처리 중...' : '가입 완료'}
                        </button>
                        {!isOAuthFlow && (
                            <div className="text-center mt-6">
                                <p className="text-sm text-slate-500">
                                    이미 계정이 있으신가요?{' '}
                                    <Link to="/login" className="font-medium text-emerald-700 hover:text-emerald-600">
                                        로그인
                                    </Link>
                                </p>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
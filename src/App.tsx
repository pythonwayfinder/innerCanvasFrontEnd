// src/App.tsx

import { Routes, Route, Link } from 'react-router-dom';
import Diary from './pages/Diary/Diary';
import DiaryEditor from './pages/Diary/DiaryEditor';

// 라우팅 테스트를 위한 임시 페이지 컴포넌트들
const MainPage = () => <div>메인 페이지</div>;
const LoginPage = () => <div>로그인/회원가입 페이지</div>;
const MyPage = () => <div>마이 페이지</div>;

function App() {
    return (
        <div className='w-250 m-auto'>
            {/* 예시 네비게이션 */}
            <nav style={{ marginBottom: '20px' }}>
                <Link to="/">메인</Link> |{' '}
                <Link to="/login">로그인</Link> |{' '}
                <Link to="/mypage">마이페이지</Link>
            </nav>

            {/* 👇 페이지 경로(URL)에 따라 보여줄 컴포넌트를 정의하는 부분 */}
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/diary" element={<Diary />} />
                <Route path="/dwrite" element={<DiaryEditor />} />
                {/* 여기에 다른 페이지 라우트들을 추가합니다. */}
            </Routes>
        </div>
    );
}

export default App;
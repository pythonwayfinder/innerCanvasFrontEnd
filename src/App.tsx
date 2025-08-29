import { Routes, Route, Link } from 'react-router-dom'
import MyPage from './pages/Mypage/Mypage.tsx'

import Diary from './pages/Diary/Diary';
import DiaryEditor from './pages/Diary/DiaryEditor';

const MainPage = () => <div>메인 페이지</div>
const LoginPage = () => <div>로그인/회원가입 페이지</div>

export default function App() {
    return (
        <div className="max-w-5xl mx-auto py-6">
            <nav className="mb-6 flex gap-4">
                <Link to="/">메인</Link>
                <Link to="/login">로그인</Link>
                <Link to="/mypage">마이페이지</Link>
            </nav>

            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/diary" element={<Diary />} />
                <Route path="/dwrite" element={<DiaryEditor />} />
                {/* 여기에 다른 페이지 라우트들을 추가합니다. */}
            </Routes>
        </div>
    )
}

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../store/store';
import { updateProfile } from '../store/authSlice';
import { updateMe, changePassword } from '../api/userApi';

// 외부 컴포넌트 (기존 그대로 사용)
import ProfileEditModal from '../components/mypage/ProfileEditModal';
import Calendar from '../components/calendar/Calendar';
import MyInquiry from '../components/inquiry/MyInquiry';

// ==============================
// 타입: 프론트에서는 birthDate 로 통일
// ==============================
type User = {
    username: string;
    email: string;
    age: number | null;
    role: string;
    birthDate: string | null; // ← 화면/스토어에서 사용하는 키
};

// ==============================
// 로컬 포함 컴포넌트: ProfileSection
// ==============================
type ProfileSectionProps = {
    user: User;
    onEditClick: () => void;
};

const ProfileSection = ({ user, onEditClick }: ProfileSectionProps) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full h-full flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-[#4D4F94] mb-6">{user.role}</h2>

            {/* 프로필 아이콘 */}
            <div className="w-32 h-32 rounded-full bg-[#E8EAF6] grid place-items-center text-[#7286D3] text-5xl font-bold mb-4">
                {user.username?.at(0)?.toUpperCase()}
            </div>

            <h3 className="text-2xl font-semibold text-gray-800">{user.username}</h3>
            <p className="text-gray-500 mt-1">{user.email}</p>

            {/* ✅ 생년월일 표시 (YYYY-MM-DD 그대로) */}
            {user.birthDate && (
                <p className="text-gray-600 mt-1">
                    <span className="font-semibold text-[#4D4F94]">생년월일:</span> {user.birthDate}
                </p>
            )}

            <button
                onClick={onEditClick}
                className="mt-auto w-full rounded-lg bg-[#7286D3] px-4 py-2.5 text-white hover:bg-[#5B6CA8] transition font-semibold"
            >
                프로필 수정
            </button>
        </div>
    );
};

// ==============================
// 페이지: MyPage
// ==============================
export default function MyPage() {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'calendar' | 'inquiry'>('calendar');

    // 라우팅은 useEffect에서 처리 (렌더 중 navigate 호출 방지)
    useEffect(() => {
        if (!isAuthenticated || !user) {
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    if (!isAuthenticated || !user) return null;

    // ✅ 프로필 저장: API는 birthDate로 전달, 응답은 birth_day_date를 birthDate로 매핑
    const handleProfileSave = async (updateData: { email: string; birthDate?: string }) => {
        const { data } = await updateMe(updateData);
        dispatch(
            updateProfile({
                username: data.username,
                email: data.email,
                role: data.role,
                age: data.age ?? undefined,
                // 백엔드 응답 키가 birth_day_date 라면 프론트 도메인 키로 변환
                birthDate: (data.birthDate ?? data.birth_day_date ?? null) as string | null,
            })
        );
        setIsModalOpen(false);
    };

    const handlePasswordSave = async (passwordData: any) => {
        await changePassword(passwordData);
    };

    return (
        <div className="flex w-full min-h-screen p-8 gap-8 bg-gray-50 items-start">
            {/* 사이드바 - 프로필 + 버튼 */}
            <aside className="w-72 flex-shrink-0">
                <ProfileSection
                    user={{
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        age: user.age ?? null,
                        birthDate: (user as any).birthDate ?? null, // 스토어에 저장된 키 사용
                    }}
                    onEditClick={() => setIsModalOpen(true)}
                />

                {/* 버튼 영역 */}
                <div className="mt-8">
                    <h2 className="text-gray-700 font-semibold mb-2">내 활동</h2>
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => setActiveTab('inquiry')}
                            className={`w-full py-2 px-4 rounded transition-colors ${
                                activeTab === 'inquiry'
                                    ? 'bg-[#4D4F94] text-white font-bold'
                                    : 'bg-[#F8F4E3] text-[#4D4F94] hover:text-[#7286D3] font-bold'
                            }`}
                        >
                            문의하기
                        </button>

                        <button
                            onClick={() => setActiveTab('calendar')}
                            className={`w-full py-2 px-4 rounded transition-colors ${
                                activeTab === 'calendar'
                                    ? 'bg-[#4D4F94] text-white font-bold'
                                    : 'bg-[#F8F4E3] text-[#4D4F94] hover:text-[#7286D3] font-bold'
                            }`}
                        >
                            감정 달력
                        </button>
                    </div>
                </div>
            </aside>

            {/* 메인 콘텐츠 */}
            <main className="flex-grow bg-white p-6 rounded-lg shadow-md">
                {activeTab === 'calendar' && <Calendar /* birthday={(user as any).birthDate ?? undefined} */ />}
                {activeTab === 'inquiry' && <MyInquiry />}
            </main>

            {/* 프로필 수정 모달 */}
            {isModalOpen && (
                <ProfileEditModal
                    user={user}
                    onClose={() => setIsModalOpen(false)}
                    onProfileSave={handleProfileSave}
                    onPasswordSave={handlePasswordSave}
                />
            )}
        </div>
    );
}

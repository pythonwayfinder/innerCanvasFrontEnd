import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../store/store';
import { updateProfile } from '../store/authSlice';
import { updateMe, changePassword } from '../api/userApi';

// 컴포넌트들
import ProfileSection from '../components/mypage/ProfileSection';
import ProfileEditModal from '../components/mypage/ProfileEditModal';
import Calendar from '../components/calendar/Calendar';
import MyInquiry from '../components/Inquiry/MyInquiry'; // ✅ 경로 및 대소문자 주의

export default function MyPage() {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'calendar' | 'inquiry'>('calendar');

    if (!isAuthenticated || !user) {
        navigate('/login', { replace: true });
        return null;
    }

    const handleProfileSave = async (updateData: { email: string; birthDate?: string }) => {
        const { data } = await updateMe(updateData);
        dispatch(
            updateProfile({
                username: data.username,
                email: data.email,
                role: data.role,
                age: data.age ?? undefined,
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
                <ProfileSection user={user} onEditClick={() => setIsModalOpen(true)} />

                {/* 버튼 영역 */}
                <div className="mt-8">
                    <h2 className="text-gray-700 font-semibold mb-2">내 활동</h2>
                    <div className="flex flex-col gap-2">
                        {/* 문의하기 버튼 */}
                        <button
                            onClick={() => setActiveTab('inquiry')}
                            className={`w-full py-2 px-4 rounded transition-colors font-bold ${
                                activeTab === 'inquiry'
                                    ? 'bg-[#4D4F94] text-white'
                                    : 'bg-[#F8F4E3] text-[#4D4F94] hover:text-[#7286D3]'
                            }`}
                        >
                            문의하기
                        </button>

                        {/* 감정 달력 버튼 */}
                        <button
                            onClick={() => setActiveTab('calendar')}
                            className={`w-full py-2 px-4 rounded transition-colors font-bold ${
                                activeTab === 'calendar'
                                    ? 'bg-[#4D4F94] text-white'
                                    : 'bg-[#F8F4E3] text-[#4D4F94] hover:text-[#7286D3]'
                            }`}
                        >
                            감정 달력
                        </button>
                    </div>
                </div>
            </aside>

            {/* 메인 콘텐츠 */}
            <main className="flex-grow bg-white p-6 rounded-lg shadow-md">
                {activeTab === 'calendar' && <Calendar />}
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
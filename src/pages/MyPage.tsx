import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../store/store';
import { updateProfile } from '../store/authSlice';
import { updateMe, changePassword } from '../api/userApi';

// 프로필 관련 컴포넌트 import
import ProfileSection from '../components/mypage/ProfileSection';
import ProfileEditModal from '../components/mypage/ProfileEditModal';
// 새로 만든 재사용 달력 컴포넌트를 import 합니다.
import Calendar from '../components/calendar/Calendar';

export default function MyPage() {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            {/* 왼쪽 프로필 섹션 */}
            <aside className="w-72 flex-shrink-0">
                <ProfileSection user={user} onEditClick={() => setIsModalOpen(true)} />
            </aside>

            {/* 중앙 메인 컨텐츠 (달력) */}
            <main className="flex-grow bg-white p-6 rounded-lg shadow-md">
                {/* 이제 달력 컴포넌트를 간단하게 렌더링하기만 하면 됩니다. */}
                <Calendar />
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
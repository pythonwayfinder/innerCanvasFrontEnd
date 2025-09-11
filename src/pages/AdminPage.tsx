import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../store/store';
import {type User, updateProfile } from '../store/authSlice';
import {type ChangePasswordPayload ,updateMe, changePassword } from '../api/userApi';

import ProfileEditModal from '../components/mypage/ProfileEditModal';
import InquiryManagement from '../components/admin/InquiryManagement';
import WebsiteAnalytics from '../components/admin/WebsiteAnalytics';

interface ProfileSectionProps {
    user: User; // Redux에서 가져온 User 타입을 사용
    onEditClick: () => void;
}



const ProfileSection = ({ user, onEditClick }: ProfileSectionProps) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-[#4D4F94] mb-6">{user.role}</h2>
            <div className="w-32 h-32 rounded-full bg-[#E8EAF6] grid place-items-center text-[#7286D3] text-5xl font-bold mb-4">
                {user.username?.at(0)?.toUpperCase()}
            </div>
            <h3 className="text-2xl font-semibold text-gray-800">{user.username}</h3>
            <p className="text-gray-500 mt-1">{user.email}</p>
            <button
                onClick={onEditClick}
                className="mt-auto w-full rounded-lg bg-[#7286D3] px-4 py-2.5 text-white hover:bg-[#5B6CA8] transition font-semibold"
            >
                관리자 정보 수정
            </button>
        </div>
    );
};


export default function AdminPage() {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'inquiry' | 'analytics'>('inquiry');


    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'ADMIN') {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, user, navigate]);


    if (!isAuthenticated || user?.role !== 'ADMIN') {
        return null;
    }

    const handleProfileSave = async (updateData: { email: string; birthDate?: string }) => {
        try {
            const { data } = await updateMe(updateData);
            dispatch(
                updateProfile({
                    username: data.username,
                    email: data.email,
                    role: data.role,
                    age: data.age ?? undefined,
                    birthDate: (data.birthDate ?? data.birth_day_date ?? null) as string | null,
                })
            );
            setIsModalOpen(false);
        } catch (error) {
            console.error("관리자 프로필 저장 실패:", error);
        }
    };


    const handlePasswordSave = async (passwordData: ChangePasswordPayload) => {
        try {
            await changePassword(passwordData);
        } catch (error) {
            console.error("관리자 비밀번호 변경 실패:", error);
        }
    };

    return (
        <div className="flex w-full min-h-screen p-8 gap-8 bg-gray-50 items-start">
            {/* 왼쪽 사이드바: 관리자 프로필 + 메뉴 */}
            <aside className="w-72 flex-shrink-0">
                <ProfileSection
                    user={user}
                    onEditClick={() => setIsModalOpen(true)}
                />

                {/* --- 수정된 부분: 관리자용 메뉴 버튼 --- */}
                <div className="mt-8">
                    <h2 className="text-gray-700 font-semibold mb-2">관리 메뉴</h2>
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => setActiveTab('inquiry')}
                            className={`w-full py-2 px-4 rounded transition-colors ${
                                activeTab === 'inquiry'
                                    ? 'bg-[#4D4F94] text-white font-bold'
                                    : 'bg-[#F8F4E3] text-[#4D4F94] hover:text-[#7286D3] font-bold'
                            }`}
                        >
                            문의 관리
                        </button>
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`w-full py-2 px-4 rounded transition-colors ${
                                activeTab === 'analytics'
                                    ? 'bg-[#4D4F94] text-white font-bold'
                                    : 'bg-[#F8F4E3] text-[#4D4F94] hover:text-[#7286D3] font-bold'
                            }`}
                        >
                            웹사이트 분석
                        </button>
                    </div>
                </div>
            </aside>

            {/* 오른쪽 메인 콘텐츠 */}
            <main className="flex-grow">
                {/* --- 수정된 부분: 탭 상태에 따라 다른 컴포넌트를 렌더링 --- */}
                {activeTab === 'inquiry' && <InquiryManagement />}
                {activeTab === 'analytics' && <WebsiteAnalytics />}
            </main>

            {/* 프로필 수정 모달 (재사용) */}
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
import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

// 필요한 타입 정의
type User = {
    username: string;
    email: string;
    birthDate?: string;
};

type ProfileEditModalProps = {
    user: User;
    onClose: () => void;
    onProfileSave: (data: { email: string; birthDate?: string }) => Promise<void>;
    onPasswordSave: (data: any) => Promise<void>;
};

const ProfileEditModal = ({ user, onClose, onProfileSave, onPasswordSave }: ProfileEditModalProps) => {
    // 프로필 정보 상태
    const [email, setEmail] = useState(user.email ?? '');
    const [birthDate, setBirthDate] = useState(user.birthDate ?? '');

    // 비밀번호 관련 상태
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVerified, setIsPasswordVerified] = useState(false);
    const [verifying, setVerifying] = useState(false);

    // 폼 전체 상태
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleVerifyPassword = async () => {
        setError(null);
        setVerifying(true);
        try {
            const response = await axiosInstance.post('/users/pass', {
                username: user.username,
                password: currentPassword
            });

            if (response.data === true) {
                setIsPasswordVerified(true);
            } else {
                setError('현재 비밀번호가 일치하지 않습니다.');
                setIsPasswordVerified(false);
            }
        } catch (err) {
            setError('비밀번호 확인 중 오류가 발생했습니다.');
            setIsPasswordVerified(false);
        } finally {
            setVerifying(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            if (isPasswordVerified && newPassword) {
                if (newPassword !== confirmPassword) {
                    throw new Error('새 비밀번호가 일치하지 않습니다.');
                }
                await onPasswordSave({ currentPassword, newPassword, confirmPassword });
            }

            await onProfileSave({ email, birthDate: birthDate || undefined });

            setSuccess('프로필이 성공적으로 저장되었습니다.');
            setTimeout(onClose, 1500);

        } catch (err: any) {
            setError(err?.response?.data?.message ?? err.message ?? '저장에 실패했습니다.');
        } finally {
            setSaving(false);
        }
    };

    const labelStyle = "block text-slate-600 text-sm font-bold mb-2";
    const inputStyle = "block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#A7D8B8] focus:border-transparent transition-colors";

    return (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-3xl text-center font-bold text-gray-700 mb-6">프로필 수정</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-md text-center">{error}</p>}
                    {success && <p className="text-sm text-green-600 bg-green-50 p-3 rounded-md text-center">{success}</p>}

                    {/* --- 순서 변경: 아이디 -> 비밀번호 -> 이메일 -> 생년월일 --- */}
                    <div>
                        <label className={labelStyle}>아이디</label>
                        <input value={user.username} className={`${inputStyle} bg-slate-100`} disabled />
                    </div>

                    <div className="pt-4 mt-4 border-t">
                        <div>
                            <label htmlFor="currentPassword" className={labelStyle}>현재 비밀번호</label>
                            <div className="flex space-x-2">
                                <input
                                    id="currentPassword"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className={inputStyle}
                                    disabled={isPasswordVerified}
                                />
                                {!isPasswordVerified && (
                                    <button
                                        type="button"
                                        onClick={handleVerifyPassword}
                                        disabled={verifying}
                                        className="px-4 py-2 bg-slate-200 text-sm rounded-md hover:bg-slate-300 flex-shrink-0 transition-colors disabled:opacity-50"
                                    >
                                        {verifying ? '확인 중...' : '확인'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {isPasswordVerified && (
                            <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-md">
                                <div>
                                    <label htmlFor="newPassword" className={labelStyle}>새 비밀번호</label>
                                    <input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputStyle}/>
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className={labelStyle}>새 비밀번호 확인</label>
                                    <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputStyle}/>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className={labelStyle}>이메일</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputStyle} />
                    </div>

                    <div>
                        <label htmlFor="birthDate" className={labelStyle}>생년월일</label>
                        <input id="birthDate" type="date" value={birthDate || ''} onChange={(e) => setBirthDate(e.target.value)} className={inputStyle} />
                    </div>

                    <div className="flex flex-col gap-3 pt-6">
                        <button type="submit" disabled={saving} className="w-full bg-[#7BAA89] hover:bg-[#699677] text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline disabled:bg-slate-300 transition-all duration-300">
                            {saving ? '저장 중…' : '변경사항 저장'}
                        </button>
                        <button type="button" onClick={onClose} className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 px-4 rounded-md transition-colors">
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileEditModal;
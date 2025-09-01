// src/pages/MyPage.tsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { logout, updateProfile } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { updateMe, changePassword } from '../api/userApi';

export default function MyPage() {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);

    const [editing, setEditing] = useState(false);
    const [email, setEmail] = useState(user?.email ?? '');
    const [birthDate, setBirthDate] = useState(user?.birthDate ?? ''); // 서버는 age만 저장(현재 설계). 화면 편의를 위해 로컬 상태 유지.
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // 비밀번호 변경
    const [changingPw, setChangingPw] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pwError, setPwError] = useState<string | null>(null);
    const [pwSuccess, setPwSuccess] = useState<string | null>(null);

    if (!isAuthenticated || !user) {
        return <div className="p-6 text-center text-gray-600">로그인이 필요합니다.</div>;
    }

    const age = user.age ?? null;

    return (
        <div className="px-4 py-10">
            {!editing ? (
                <div className="w-full max-w-md mx-auto">
                    <div className="relative">
                        <div className="absolute -inset-2 rounded-3xl bg-black/5 blur-xl" />
                        <div className="relative rounded-3xl bg-white shadow-xl p-8">
                            <h2 className="text-center text-gray-800 font-semibold mb-6">My Page</h2>

                            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 grid place-items-center text-gray-400 text-2xl font-bold">
                                {user.username.at(0)}
                            </div>

                            <h3 className="text-2xl font-semibold text-center mt-4">{user.username}</h3>

                            <div className="mt-3 space-y-1 text-gray-600 text-sm text-center">
                                <p>Email: {user.email}</p>
                                <p>
                                    나이: {age !== null ? `${age}세` : '-'}
                                    {user.birthDate ? ` (${user.birthDate})` : ''}
                                </p>
                                <p>Role: {user.role}</p>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => {
                                        setEmail(user.email);
                                        setBirthDate(user.birthDate ?? '');
                                        setEditing(true);
                                    }}
                                    className="rounded-xl border border-teal-700 px-4 py-2 text-teal-800 hover:bg-teal-50 transition"
                                >
                                    Edit Profile
                                </button>

                                <button
                                    onClick={() => {
                                        dispatch(logout());
                                        navigate('/login', { replace: true });
                                    }}
                                    className="rounded-xl border border-red-600 px-4 py-2 text-red-700 hover:bg-red-50 transition"
                                >
                                    Logout
                                </button>
                            </div>

                            <div className="mt-4 text-center">
                                <button
                                    onClick={() => setChangingPw(true)}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    비밀번호 변경
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <form
                    className="w-full max-w-md mx-auto"
                    onSubmit={async (e) => {
                        e.preventDefault();
                        setSaving(true);
                        setSaveError(null);
                        try {
                            const { data } = await updateMe({
                                email,
                                birthDate: birthDate || undefined,
                            });

                            // 백엔드는 UserDto(단일 객체)를 반환하므로 data 자체가 사용자 정보입니다.
                            dispatch(
                                updateProfile({
                                    username: data.username,
                                    email: data.email,
                                    role: data.role,
                                    age: data.age ?? undefined,
                                    // 주의: 현재 백엔드는 birthDate를 저장하지 않습니다(나이만 저장).
                                    // 화면 표시에 필요하면 로컬 상태(birthDate)만 유지하세요.
                                })
                            );

                            setEditing(false);
                        } catch (err: any) {
                            setSaveError(err?.response?.data?.message ?? '프로필 저장에 실패했습니다.');
                        } finally {
                            setSaving(false);
                        }
                    }}
                >
                    <div className="relative">
                        <div className="absolute -inset-2 rounded-3xl bg-black/5 blur-xl" />
                        <div className="relative rounded-3xl bg-white shadow-xl p-8 space-y-4">
                            <h2 className="text-center text-gray-800 font-semibold">Edit Profile</h2>

                            {saveError && (
                                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                                    {saveError}
                                </p>
                            )}

                            <label className="block">
                                <span className="text-sm text-gray-600">Username</span>
                                <input
                                    value={user.username}
                                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 bg-gray-50"
                                    disabled
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm text-gray-600">Email</span>
                                <input
                                    type="email"
                                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm text-gray-600">생년월일</span>
                                <input
                                    type="date"
                                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
                                    value={birthDate || ''}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                />
                                <span className="text-xs text-gray-500">
                  저장하면 서버에서 나이를 재계산합니다.
                </span>
                            </label>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 rounded-xl bg-teal-600 text-white py-2 hover:bg-teal-700 transition disabled:opacity-60"
                                >
                                    {saving ? 'Saving…' : 'Save'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditing(false)}
                                    className="flex-1 rounded-xl border border-gray-300 py-2 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            )}

            {changingPw && (
                <form
                    className="w-full max-w-md mx-auto mt-6"
                    onSubmit={async (e) => {
                        e.preventDefault();
                        setPwError(null);
                        setPwSuccess(null);
                        if (newPassword !== confirmPassword) {
                            setPwError('새 비밀번호가 일치하지 않습니다.');
                            return;
                        }
                        try {
                            await changePassword({ currentPassword, newPassword, confirmPassword });
                            setPwSuccess('비밀번호가 변경되었습니다.');
                            setCurrentPassword('');
                            setNewPassword('');
                            setConfirmPassword('');
                            setTimeout(() => setChangingPw(false), 800); // UX: 잠깐 성공 메시지 후 닫기
                        } catch (err: any) {
                            setPwError(err?.response?.data?.message ?? '비밀번호 변경에 실패했습니다.');
                        }
                    }}
                >
                    <div className="rounded-2xl bg-white shadow-xl p-6 space-y-4">
                        <h2 className="text-center font-semibold">비밀번호 변경</h2>
                        {pwError && <p className="text-sm text-red-600">{pwError}</p>}
                        {pwSuccess && <p className="text-sm text-green-600">{pwSuccess}</p>}

                        <label className="block">
                            <span className="text-sm text-gray-600">현재 비밀번호</span>
                            <input
                                type="password"
                                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm text-gray-600">새 비밀번호</span>
                            <input
                                type="password"
                                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm text-gray-600">새 비밀번호 확인</span>
                            <input
                                type="password"
                                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </label>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                className="flex-1 rounded-xl bg-teal-600 text-white py-2 hover:bg-teal-700 transition"
                            >
                                변경하기
                            </button>
                            <button
                                type="button"
                                onClick={() => setChangingPw(false)}
                                className="flex-1 rounded-xl border border-gray-300 py-2 hover:bg-gray-50 transition"
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}
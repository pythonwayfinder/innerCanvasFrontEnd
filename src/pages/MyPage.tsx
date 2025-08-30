// src/pages/MyPage.tsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { logout, updateProfile } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

export default function MyPage() {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);

    const [editing, setEditing] = useState(false);
    const [username, setUsername] = useState(user?.username ?? '');
    const [email, setEmail] = useState(user?.email ?? '');

    if (!isAuthenticated || !user) {
        return <div className="p-6 text-center text-gray-600">로그인이 필요합니다.</div>;
    }

    return (
        <div className="px-4 py-10">
            {!editing ? (
                <div className="w-full max-w-md mx-auto">
                    <div className="relative">
                        <div className="absolute -inset-2 rounded-3xl bg-black/5 blur-xl"></div>
                        <div className="relative rounded-3xl bg-white shadow-xl p-8">
                            <h2 className="text-center text-gray-800 font-semibold mb-6">My Page</h2>

                            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 grid place-items-center text-gray-400 text-2xl font-bold">
                                {user.username.at(0)}
                            </div>

                            <h3 className="text-2xl font-semibold text-center mt-4">{user.username}</h3>

                            <div className="mt-3 space-y-1 text-gray-600 text-sm text-center">
                                <p>Email: {user.email}</p>
                                <p>Role: {user.role}</p>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => { setUsername(user.username); setEmail(user.email); setEditing(true); }}
                                    className="rounded-xl border border-teal-700 px-4 py-2 text-teal-800 hover:bg-teal-50 transition"
                                >
                                    Edit Profile
                                </button>

                                <button
                                    onClick={() => { dispatch(logout()); navigate('/login', { replace: true }); }}
                                    className="rounded-xl border border-red-600 px-4 py-2 text-red-700 hover:bg-red-50 transition"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <form
                    className="w-full max-w-md mx-auto"
                    onSubmit={(e) => {
                        e.preventDefault();
                        dispatch(updateProfile({ username, email }));
                        setEditing(false);
                    }}
                >
                    <div className="relative">
                        <div className="absolute -inset-2 rounded-3xl bg-black/5 blur-xl"></div>
                        <div className="relative rounded-3xl bg-white shadow-xl p-8 space-y-4">
                            <h2 className="text-center text-gray-800 font-semibold">Edit Profile</h2>

                            <label className="block">
                                <span className="text-sm text-gray-600">Username</span>
                                <input
                                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm text-gray-600">Email</span>
                                <input
                                    type="email"
                                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </label>

                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="flex-1 rounded-xl bg-teal-600 text-white py-2 hover:bg-teal-700 transition">
                                    Save
                                </button>
                                <button type="button" onClick={() => setEditing(false)} className="flex-1 rounded-xl border border-gray-300 py-2 hover:bg-gray-50 transition">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}
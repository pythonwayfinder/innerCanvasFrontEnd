import axiosInstance from './axiosInstance';
import type { User } from '../store/authSlice';

export interface LoginResponse {
    accessToken?: string | null;
    user: User;
}

export interface UpdateMePayload {
    email?: string;
    birthDate?: string; // "YYYY-MM-DD"
}

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

/** 프로필 수정 */
export function updateMe(payload: UpdateMePayload) {
    return axiosInstance.put<User>('/users/me', payload);
}

/** 비밀번호 변경 */
export function changePassword(payload: ChangePasswordPayload) {
    return axiosInstance.put<void>('/users/me/password', payload);
}

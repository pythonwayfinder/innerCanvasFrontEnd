import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type User = { name: string; email: string; age: number } | null

type AuthState = {
    isLoggedIn: boolean
    user: User
}

// 데모용 초기값(원하면 false/null로 시작 가능)
const initialState: AuthState = {
    isLoggedIn: true,
    user: { name: 'Haneul Kim', email: 'haneul.kim@example.com', age: 30 },
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action: PayloadAction<NonNullable<User>>) {
            state.isLoggedIn = true
            state.user = action.payload
        },
        logout(state) {
            state.isLoggedIn = false
            state.user = null
        },
        updateProfile(state, action: PayloadAction<Partial<NonNullable<User>>>) {
            if (!state.user) return
            state.user = { ...state.user, ...action.payload }
        },
    },
})

export const { login, logout, updateProfile } = authSlice.actions
export default authSlice.reducer

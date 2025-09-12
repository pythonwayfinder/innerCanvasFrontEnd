import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// --- 타입 정의 ---
export interface ChatDto {
    sender: string;
    message: string;
    // 백엔드에서 오는 다른 필드가 있다면 여기에 추가할 수 있습니다.
}

export interface Diary {
    diaryId: number;
    diaryText: string;
    moodColor?: string;
    doodleUrl?: string;
    aiCounselingText?: string;
    createdAt: string;
    chatDtos?: ChatDto[]; // ✅ 이 줄을 추가하세요.
}


export interface ChatMessage {
    sender: "user" | "ai";
    message: string;
}

interface DiaryState {
    currentDiary: Diary | null;
    messages: ChatMessage[];
    isAiResponding: boolean;
    tempGuestId: string | null; // ✅ [추가] 비회원 임시 ID 상태
}

const initialState: DiaryState = {
    currentDiary: null,
    messages: [],
    isAiResponding: false,
    tempGuestId: null, // ✅ [추가] 초기값 null로 설정
};

const diarySlice = createSlice({
    name: 'diary',
    initialState,
    reducers: {
        setCurrentDiary(state, action: PayloadAction<{ diary: Diary | null; messages: ChatMessage[] }>) {
            state.currentDiary = action.payload.diary;
            state.messages = action.payload.messages;
        },
        setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
            state.messages = action.payload;
        },
        addMessage: (state, action: PayloadAction<ChatMessage>) => {
            state.messages.push(action.payload);
        },
        setIsAiResponding: (state, action: PayloadAction<boolean>) => {
            state.isAiResponding = action.payload;
        },
        // ✅ [추가] 비회원 임시 ID를 저장하는 리듀서
        setTempGuestId: (state, action: PayloadAction<string>) => {
            state.tempGuestId = action.payload;
        },
        // 페이지를 떠나거나 날짜가 바뀔 때 상태를 초기화합니다.
        resetDiaryState: (state) => {
            state.currentDiary = null;
            state.messages = [];
            state.isAiResponding = false;
            state.tempGuestId = null; // ✅ [추가] 임시 ID도 함께 초기화
        },
    },
});

// ✅ [추가] 새로 만든 setTempGuestId 액션을 export 합니다.
export const {
    setCurrentDiary,
    setMessages,
    addMessage,
    resetDiaryState,
    setIsAiResponding,
    setTempGuestId
} = diarySlice.actions;

export default diarySlice.reducer;
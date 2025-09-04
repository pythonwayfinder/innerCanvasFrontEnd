import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// --- 타입 정의 (이전과 동일) ---
export interface Diary {
    diaryId: number;
    diaryText: string;
    moodColor?: string;
    doodleUrl?: string;
    aiCounselingText?: string;
    createdAt: string;
}

export interface ChatMessage {
    sender: "user" | "ai";
    message: string;
}

interface DiaryState {
    currentDiary: Diary | null;
    messages: ChatMessage[];
    isAiResponding: boolean; // 👈 AI 응답 상태 추가
}

const initialState: DiaryState = {
    currentDiary: null,
    messages: [],
    isAiResponding: false, // 👈 초기값 설정
};

// --- 여기가 핵심입니다: createAsyncThunk를 모두 제거했습니다. ---
const diarySlice = createSlice({
    name: 'diary',
    initialState,
    // 오직 단순한 동기적 상태 변경 로직만 남깁니다.
    reducers: {
        // API 호출 성공 후, 컴포넌트가 이 액션을 호출하여 스토어를 업데이트합니다.
        setCurrentDiary(state, action: PayloadAction<{ diary: Diary | null; messages: ChatMessage[] }>) {
            // payload에서 diary와 messages를 각각 꺼내 state에 할당합니다.
            state.currentDiary = action.payload.diary;
            state.messages = action.payload.messages;
        },
        // 채팅 메시지가 추가될 때마다 호출됩니다.
        setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
            state.messages = action.payload;
        },
        addMessage: (state, action: PayloadAction<ChatMessage>) => {
            state.messages.push(action.payload);
        },
        setIsAiResponding: (state, action: PayloadAction<boolean>) => {
            state.isAiResponding = action.payload;
        },
        // 페이지를 떠나거나 날짜가 바뀔 때 상태를 초기화합니다.
        resetDiaryState: (state) => {
            state.currentDiary = null;
            state.messages = [];
            state.isAiResponding = false;
        },
    },
});

export const { setCurrentDiary, setMessages, addMessage, resetDiaryState, setIsAiResponding} = diarySlice.actions;
export default diarySlice.reducer;
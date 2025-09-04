import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface DiaryState {
    selectedDiaryId: number | null;
    initialAnalysis: string | null;
}

const initialState: DiaryState = {
    selectedDiaryId: null,
    initialAnalysis: null,
};

const diarySlice = createSlice({
    name: 'diary',
    initialState,
    reducers: {
        // 일기가 선택/로드되었을 때 호출될 액션
        setSelectedDiary: (state, action: PayloadAction<number | null>) => {
            state.selectedDiaryId = action.payload;
            // 일기가 바뀌면 이전 분석 결과는 초기화
            if (state.selectedDiaryId === null) {
                state.initialAnalysis = null;
            }
        },
        // AI 분석이 완료되었을 때 호출될 액션
        setInitialAnalysis: (state, action: PayloadAction<string | null>) => {
            state.initialAnalysis = action.payload;
        },
        // 날짜가 변경되는 등 상태를 완전히 초기화할 때
        clearDiaryState: (state) => {
            state.selectedDiaryId = null;
            state.initialAnalysis = null;
        }
    },
});

export const { setSelectedDiary, setInitialAnalysis, clearDiaryState } = diarySlice.actions;
export default diarySlice.reducer;
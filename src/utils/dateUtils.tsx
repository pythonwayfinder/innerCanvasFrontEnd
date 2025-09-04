// src/utils/dateUtils.ts
export function getKoreanDateString(date: Date): string {
    // 브라우저는 기본적으로 로컬 시간(KST 기준)으로 Date 객체를 처리하므로, 별도 보정이 필요 없음
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}
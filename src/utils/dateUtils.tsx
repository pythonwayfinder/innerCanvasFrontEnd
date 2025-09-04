// src/utils/dateUtils.ts
export function getKoreanDateString(date: Date): string {
    const koreaOffset = 9 * 60 * 60 * 1000;
    const koreanTime = new Date(date.getTime() + koreaOffset);

    const year = koreanTime.getFullYear();
    const month = String(koreanTime.getMonth() + 1).padStart(2, "0");
    const day = String(koreanTime.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}
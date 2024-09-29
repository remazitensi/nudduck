/**
 * File Name    : change-date-format.tsx
 * Description  : 세계 표준시를 한국 시간으로, yyyy-mm-dd 형식에 맞춰서 리턴하는 함수
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.30    김민지      Created
 */

export const changeDateWithFormat = (utcDate: string) => {
  const date = new Date(utcDate);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // 월은 0부터 시작합니다.
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`; // 형식: yyyy-mm-dd
};

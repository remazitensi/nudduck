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

  // 로컬 시간 기준으로 년, 월, 일을 가져옴
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`; // 형식: yyyy-mm-dd
};

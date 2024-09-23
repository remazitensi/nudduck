/**
 * File Name    : cookie-helper.ts
 * Description  : 쿠키옵션 설정 헬퍼함수
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.16    이승철      Created
 * 2024.09.24    이승철      Modified    httpOnly false로 변경
 */

import { CookieOptions } from "express";

export const getAccessCookieOptions = (): CookieOptions => {
    return {
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000, // 1시간
    };
  };
  
  export const getRefreshCookieOptions = (): CookieOptions => {
    return {
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3일
    };
  };
  
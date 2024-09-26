/**
 * File Name    : express.d.ts
 * Description  : Express Request 객체에 사용자 정보를 추가하기 위한 타입 정의 파일
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.19    김재영      Created     Express Request 객체에 user 속성을 추가
 */

import { User } from '@_modules/user/entity/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: User; // Express Request 객체에 user 속성을 추가, 이 속성은 인증된 사용자의 정보를 포함
    }
  }
}

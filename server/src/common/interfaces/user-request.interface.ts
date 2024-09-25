/**
 * File Name    : req-user.interface.ts
 * Description  : request 객체 확장
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.17    이승철      Created
 * 2024.09.17    이승철      Modified    request 객체에 user 타입 확장
 * 2024.09.24    이승철      Modified    request 객체에 cookies 타입 확장
 */

import { User } from '@_modules/user/entity/user.entity';
import { Request } from 'express';

export interface UserRequest extends Request {
  user: User;
  cookies: { [key: string]: string };
}

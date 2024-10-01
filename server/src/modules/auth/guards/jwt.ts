/**
 * File Name    : jwt.ts
 * Description  : jwt 가드설정
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    이승철      Created
 * 2024.09.29    이승철      Modified    타입 명시
 */

import { User } from '@_modules/user/entity/user.entity';
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRequest } from 'common/interfaces/user-request.interface';

@Injectable()
export class Jwt extends AuthGuard('jwt') {
  handleRequest<TUser extends User>(err: Error | null, user: TUser, info: string | undefined, context: ExecutionContext): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    const req = context.switchToHttp().getRequest<UserRequest>();
    req.user = user;
    return user;
  }
}

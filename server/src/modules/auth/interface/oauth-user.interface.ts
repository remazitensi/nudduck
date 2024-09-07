/**
 * File Name    : oauth-user.interface.ts
 * Description  : auth에서 사용할 OauthUser 타입 interface 설정
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    이승철      Created
 * 2024.09.07    이승철      Modified    OauthUser 타입 interface 설정
 */

export interface OAuthUser {
  provider: string;
  providerId: string;
  name: string;
  email: string;
}

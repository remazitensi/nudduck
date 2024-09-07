import { UserDto } from '@_auth/dto/user.dto';
import { User } from '@_user/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 소셜 로그인 제공자와 사용자 고유 ID로 사용자 조회
  async findUserByProvider(provider: string, providerId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { provider, providerId, deletedAt: null },
    });
  }

  // 사용자 ID로 사용자 조회
  async findUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id, deletedAt: null } });
  }

  // 사용자 생성
  async createUser(userDto: UserDto): Promise<User> {
    const newUser = this.userRepository.create({
      provider: userDto.provider,
      providerId: userDto.providerId,
      name: userDto.name,
      email: userDto.email,
    });
    return this.userRepository.save(newUser);
  }

  // 리프레시 토큰 업데이트
  async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
    await this.userRepository.update(userId, { refreshToken });
  }
}

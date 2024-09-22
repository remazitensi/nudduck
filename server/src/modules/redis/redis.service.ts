import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  private subscriber: RedisClientType;

  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType) {
    this.subscriber = this.redisClient.duplicate(); // 구독을 위한 별도의 클라이언트 인스턴스
  }

  getClient(): RedisClientType {
    return this.redisClient;
  }

  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string): Promise<string> {
    return await this.redisClient.set(key, value);
  }

  async del(key: string): Promise<number> {
    return await this.redisClient.del(key);
  }

  async publish(channel: string, message: string): Promise<number> {
    return await this.redisClient.publish(channel, message);
  }

  async subscribe(channel: string): Promise<void> {
    await this.subscriber.connect();
    await this.subscriber.subscribe(channel, async (message: string) => {
      try {
        const parsedMessage = JSON.parse(message);

        // 메시지를 Redis의 특정 키에 저장
        const key = `message:${parsedMessage.id}`; // 메시지 ID를 키로 사용
        await this.set(key, JSON.stringify(parsedMessage)); // Redis에 메시지 저장
      } catch (error) {
        throw new HttpException(`Failed to parse message: ${error.message}`, HttpStatus.BAD_REQUEST);
      }
    });
  }

  async unsubscribe(channel: string): Promise<void> {
    await this.subscriber.unsubscribe(channel);
  }
}

import { Injectable, Inject, Logger } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private subscriber: RedisClientType;

  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType) {
    this.subscriber = this.redisClient.duplicate(); // 구독을 위한 별도의 클라이언트 인스턴스
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.redisClient.get(key);
    } catch (error) {
      this.logger.error(`Error getting key ${key}: ${error.message}`);
      throw error;
    }
  }

  async set(key: string, value: string): Promise<string> {
    try {
      return await this.redisClient.set(key, value);
    } catch (error) {
      this.logger.error(`Error setting key ${key}: ${error.message}`);
      throw error;
    }
  }

  async del(key: string): Promise<number> {
    try {
      return await this.redisClient.del(key);
    } catch (error) {
      this.logger.error(`Error deleting key ${key}: ${error.message}`);
      throw error;
    }
  }

  async publish(channel: string, message: string): Promise<number> {
    try {
      return await this.redisClient.publish(channel, message);
    } catch (error) {
      this.logger.error(`Error publishing to channel ${channel}: ${error.message}`);
      throw error;
    }
  }

  async subscribe(channel: string): Promise<void> {
    try {
      await this.subscriber.connect();
      await this.subscriber.subscribe(channel, (message: string) => {
        this.logger.log(`Received message on channel ${channel}: ${message}`);
      });
    } catch (error) {
      this.logger.error(`Error subscribing to channel ${channel}: ${error.message}`);
      throw error;
    }
  }

  async unsubscribe(channel: string): Promise<void> {
    try {
      await this.subscriber.unsubscribe(channel);
    } catch (error) {
      this.logger.error(`Error unsubscribing from channel ${channel}: ${error.message}`);
      throw error;
    }
  }
}

import { Module, Global, HttpException, HttpStatus } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisService } from './redis.service';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisHost = configService.get<string>('REDIS_HOST');
        const redisPort = configService.get<number>('REDIS_PORT');
        const redisPassword = configService.get<string>('REDIS_PASSWORD');
        const redisDb = configService.get<number>('REDIS_DB');

        const client = createClient({
          url: `redis://${redisHost}:${redisPort}/${redisDb}`,
          password: redisPassword,
        });

        try {
          await client.connect();
        } catch (error) {
          throw new HttpException(`Redis 연결 실패: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return client;
      },
    },
  ],
  exports: [RedisService, 'REDIS_CLIENT'],
})
export class RedisModule {}

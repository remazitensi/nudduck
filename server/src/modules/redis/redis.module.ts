import { Module, Global } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisService } from './redis.service';
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_DB } from './redis.constant';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        const client = createClient({
          url: `redis://${REDIS_HOST}:${REDIS_PORT}/${REDIS_DB}`,
          password: REDIS_PASSWORD,
        });
        await client.connect();
        return client;
      },
    },
  ],
  exports: [RedisService, 'REDIS_CLIENT'],
})
export class RedisModule {}

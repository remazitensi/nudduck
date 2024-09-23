import { Module } from '@nestjs/common';
import { ChatService } from '@_modules/chat/chat.service';
import { ChatGateway } from '@_modules/chat/gateway/chat.gateway';
import { RoomRepository } from '@_modules/chat/repositories/room.repository';
import { MessageRepository } from '@_modules/chat/repositories/message.repository';
import { ChatController } from '@_modules/chat/chat-controller';
import { AuthModule } from '@_modules/auth/auth.module';
import { RedisModule } from '@_modules/redis/redis.module';

@Module({
  imports: [AuthModule, RedisModule],
  providers: [ChatService, ChatGateway, RoomRepository, MessageRepository],
  controllers: [ChatController],
  exports: [ChatService, RoomRepository, MessageRepository],
})
export class ChatModule {}

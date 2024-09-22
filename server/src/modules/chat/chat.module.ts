import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './gateway/chat.gateway';
import { RoomRepository } from './repositories/room.repository';
import { MessageRepository } from './repositories/message.repository';
import { ChatController } from './chat-controller';

@Module({
  providers: [ChatService, ChatGateway, RoomRepository, MessageRepository],
  controllers: [ChatController],
  exports: [ChatService, RoomRepository, MessageRepository],
})
export class ChatModule {}

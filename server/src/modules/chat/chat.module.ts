import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatGateway } from './gateway/chat.gateway';
import { ChatRoom } from './entities/chat-room.entity';
import { Message } from './entities/message.entity';
import { RoomRepository } from './repositories/room.repository';
import { MessageRepository } from './repositories/message.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, Message])],
  providers: [ChatService, ChatGateway, RoomRepository, MessageRepository],
  exports: [ChatService],
})
export class ChatModule {}

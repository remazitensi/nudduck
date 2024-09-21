import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, UseGuards, WsException } from '@nestjs/websockets';
import { Server } from 'socket.io';
// import { Jwt } from '../auth/guards/jwt-auth.guard';
import { ChatService } from '../chat.service';
import { SendMessageDto } from '../dto/send-message.dto';

@UseGuards(Jwt)
@WebSocketGateway({ namespace: '/chat', cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@MessageBody() chatroomId: number) {
    this.server.to(chatroomId.toString()).emit('joinedRoom', chatroomId);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() sendMessageDto: SendMessageDto) {
    const { chatroomId, senderId, content } = sendMessageDto;

    try {
      const savedMessage = await this.chatService.saveMessage(senderId, chatroomId, content);
      this.server.to(chatroomId.toString()).emit('newMessage', savedMessage);
    } catch (error) {
      throw new WsException(`메시지를 보낼 수 없습니다: ${error.message}`);
    }
  }
}

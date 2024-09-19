import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, UseGuards, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
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
  async handleJoinRoom(@MessageBody() roomId: number, @ConnectedSocket() client: Socket) {
    client.join(roomId.toString());
    client.emit('joinedRoom', roomId);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() { message: content }: SendMessageDto, @ConnectedSocket() client: Socket, @MessageBody() roomId: number, @MessageBody() senderId: number) {
    try {
      const savedMessage = await this.chatService.saveMessage(senderId, roomId, content);
      this.server.to(roomId.toString()).emit('newMessage', savedMessage);
    } catch (error) {
      throw new WsException(`메시지를 보낼 수 없습니다: ${error.message}`);
    }
  }
}

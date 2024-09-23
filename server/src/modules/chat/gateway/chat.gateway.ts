import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from '@_modules/chat/chat.service';
import { CreateRoomDto } from '@_modules/chat/dto/create-room.dto';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = Array.isArray(client.handshake.query.token) ? client.handshake.query.token[0] : client.handshake.query.token; // 배열이면 첫 번째 요소를 사용

    if (!token) {
      throw new UnauthorizedException('토큰이 제공되지 않았습니다.');
    }

    try {
      const user = await this.jwtService.verifyAsync(token);
      client['user'] = user;
      console.log(`클라이언트가 연결되었습니다: ${client.id}, 사용자: ${client['user'].id}`);
    } catch {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`클라이언트가 연결을 끊었습니다: ${client.id}`);
  }

  @SubscribeMessage('createRoom')
  async handleCreateRoom(client: Socket, createRoomDto: CreateRoomDto) {
    const participants = createRoomDto.participants;
    const userId = client['user'].id;

    if (!participants.includes(userId)) {
      participants.push(userId);
    }

    const newRoom = await this.chatService.createRoom({
      chatroomName: createRoomDto.chatroomName,
      participants: participants,
    } as CreateRoomDto);

    client.emit('roomCreated', newRoom);
  }
}

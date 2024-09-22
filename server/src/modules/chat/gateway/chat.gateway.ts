import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from '../chat.service';
import { CreateRoomDto } from '../dto/create-room.dto';
import { Jwt } from '../auth/jwt';
import { UnauthorizedException } from '@nestjs/common';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwt: Jwt,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.query.token; // 쿼리에서 토큰 추출

    if (!token) {
      throw new UnauthorizedException('토큰이 제공되지 않았습니다.');
    }

    const context: any = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: `Bearer ${token}` },
        }),
      }),
    };

    const user = this.jwt.handleRequest(null, null, null, context); // JWT 가드를 사용하여 사용자 검증

    if (!user) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    client['user'] = user; // 사용자 정보를 클라이언트에 저장
    console.log(`클라이언트가 연결되었습니다: ${client.id}, 사용자: ${client['user'].id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`클라이언트가 연결을 끊었습니다: ${client.id}`);
  }

  @SubscribeMessage('createRoom')
  async handleCreateRoom(client: Socket, createRoomDto: CreateRoomDto) {
    const participants = createRoomDto.participants; // participants 배열을 가져옵니다.
    const userId = client['user'].id;

    // 현재 사용자 ID가 참가자 목록에 없으면 추가
    if (!participants.includes(userId)) {
      participants.push(userId);
    }

    const newRoom = await this.chatService.createRoom({
      chatroomName: createRoomDto.chatroomName,
      participants: participants, // participants가 포함되어 있는지 확인
    } as CreateRoomDto); // 명시적으로 타입을 지정

    // 새로운 채팅방 정보를 클라이언트에게 전송
    client.emit('roomCreated', newRoom);
  }
}

import { ChatService } from '@_modules/chat/chat.service';
import { CreateRoomDto } from '@_modules/chat/dto/create-room.dto';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL, // 프론트엔드 URL
    credentials: true, // 인증 정보를 포함한 요청을 허용
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    // 쿠키에서 JWT 토큰 추출
    const cookies = client.handshake.headers.cookie; // 모든 쿠키 가져오기
    const token = this.getCookieValue(cookies, 'accessToken'); // 'accessToken' 쿠키 추출

    if (!token) {
      client.disconnect(true); // 토큰이 없으면 연결 끊기
      throw new UnauthorizedException('토큰이 제공되지 않았습니다.');
    }

    try {
      const user = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET, // 비밀키를 명시적으로 지정
      });

      if (!user) {
        client.disconnect(true);
        throw new UnauthorizedException('유효하지 않은 사용자입니다.');
      }

      client['user'] = user;
      console.log(`클라이언트가 연결되었습니다: ${client.id}, 사용자: ${client['user'].id}`);
    } catch {
      client.disconnect(true); // 유효하지 않은 토큰이면 연결 끊기
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

  // 쿠키에서 특정 쿠키 값을 추출하는 함수
  private getCookieValue(cookies: string, cookieName: string): string | null {
    if (!cookies) return null;
    const match = cookies.match(new RegExp('(^| )' + cookieName + '=([^;]+)'));
    if (match) {
      return match[2]; // 쿠키 값 반환
    }
    return null;
  }
}

import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { CreateRoomDto } from '@_modules/chat/dto/create-room.dto';
import { SendMessageDto } from '@_modules/chat/dto/send-message.dto';
import { RedisService } from '@_modules/redis/redis.service';

@ApiTags('Chat')
@Controller('chat/rooms')
export class ChatController {
  constructor(private readonly redisService: RedisService) {}

  @ApiOperation({ summary: '새로운 1대1 채팅방 생성' })
  @Post()
  async createChatRoom(@Body() createRoomDto: CreateRoomDto) {
    const roomId = `${Date.now()}`; // 고유한 채팅방 ID 생성
    const initialMessages = JSON.stringify([]); // 빈 메시지 배열로 초기화
    await this.redisService.getClient().set(roomId, initialMessages); // Redis에 빈 메시지 배열 저장

    // 참가자 목록을 Redis에 저장
    const participantsKey = `participants:${roomId}`;
    await this.redisService.getClient().set(participantsKey, JSON.stringify(createRoomDto.participants));

    return { roomId }; // 생성된 채팅방 ID 반환
  }

  @ApiOperation({ summary: '채팅방 목록 조회' })
  @Get()
  async getChatRooms() {
    const keys = await this.redisService.getClient().keys('participants:*');
    const rooms = await Promise.all(
      keys.map(async (key) => {
        const roomId = key.split(':')[1];
        const participants = JSON.parse(await this.redisService.getClient().get(key));
        return { roomId, participants };
      }),
    );
    return rooms; // 채팅방 목록 반환
  }

  @ApiOperation({ summary: '특정 채팅방의 메시지 조회' })
  @ApiParam({ name: 'roomId', description: '채팅방 ID' })
  @Get(':roomId/messages')
  async getMessages(@Param('roomId') roomId: string) {
    const messages = await this.redisService.getClient().get(roomId);
    if (!messages) {
      return { message: '채팅방을 찾을 수 없습니다.' };
    }
    return JSON.parse(messages); // 메시지 반환
  }

  @ApiOperation({ summary: '채팅방에 메시지 전송' })
  @ApiParam({ name: 'roomId', description: '채팅방 ID' })
  @Post(':roomId/send')
  async sendMessage(@Param('roomId') roomId: string, @Body() sendMessageDto: SendMessageDto) {
    const messages = await this.redisService.getClient().get(roomId);
    if (!messages) {
      return { message: '채팅방을 찾을 수 없습니다.' };
    }

    const newMessage = {
      id: `${Date.now()}`, // 메시지 ID 생성
      content: sendMessageDto.content,
      sender: sendMessageDto.senderId,
    };

    const updatedMessages = JSON.parse(messages);
    updatedMessages.push(newMessage); // 메시지 추가
    await this.redisService.getClient().set(roomId, JSON.stringify(updatedMessages)); // Redis에 업데이트

    return newMessage; // 생성된 메시지 정보 반환
  }
}

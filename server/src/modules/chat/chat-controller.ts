import { Controller, Post, Get, Param, Body, Delete } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { CreateRoomDto } from './dto/create-room.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { RedisService } from 'modules/redis/redis.service';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly redisService: RedisService) {}

  @ApiOperation({ summary: '새로운 1대1 채팅방 생성' })
  @Post()
  async createChatRoom(@Body() createRoomDto: CreateRoomDto) {
    const roomId = `${Date.now()}`; // 고유한 채팅방 ID 생성
    await this.redisService.getClient().set(roomId, JSON.stringify([])); // 빈 메시지 배열로 초기화
    return { roomId }; // 생성된 채팅방 ID 반환
  }

  @ApiOperation({ summary: '특정 채팅방의 메시지 조회' })
  @ApiParam({ name: 'roomId', description: '채팅방 ID' })
  @Get(':roomId')
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
      sender: sendMessageDto.sender,
    };

    const updatedMessages = JSON.parse(messages);
    updatedMessages.push(newMessage); // 메시지 추가
    await this.redisService.getClient().set(roomId, JSON.stringify(updatedMessages)); // Redis에 업데이트

    return newMessage; // 생성된 메시지 정보 반환
  }

  @ApiOperation({ summary: '채팅 메시지 삭제' })
  @ApiParam({ name: 'roomId', description: '채팅방 ID' })
  @ApiParam({ name: 'messageId', description: '메시지 ID' })
  @Delete(':roomId/delete/:messageId')
  async deleteMessage(@Param('roomId') roomId: string, @Param('messageId') messageId: string) {
    const messages = await this.redisService.getClient().get(roomId);
    if (!messages) {
      return { message: '채팅방을 찾을 수 없습니다.' };
    }

    const updatedMessages = JSON.parse(messages).filter((msg) => msg.id !== messageId); // 해당 ID의 메시지 필터링
    await this.redisService.getClient().set(roomId, JSON.stringify(updatedMessages)); // Redis에 업데이트

    return { message: '메시지가 삭제되었습니다.' };
  }
}

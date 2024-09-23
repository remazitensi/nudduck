import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { CreateRoomDto } from '@_modules/chat/dto/create-room.dto';
import { SendMessageDto } from '@_modules/chat/dto/send-message.dto';

@ApiTags('Chat')
@Controller('chat/rooms')
export class ChatController {
  private chatRooms: { [roomId: string]: { participants: number[]; messages: any[] } } = {};

  @ApiOperation({ summary: '새로운 1대1 채팅방 생성' })
  @Post()
  async createChatRoom(@Body() createRoomDto: CreateRoomDto) {
    const roomId = `${Date.now()}`; // 고유한 채팅방 ID 생성
    this.chatRooms[roomId] = {
      participants: createRoomDto.participants,
      messages: [], // 빈 메시지 배열로 초기화
    };

    return { roomId }; // 생성된 채팅방 ID 반환
  }

  @ApiOperation({ summary: '채팅방 목록 조회' })
  @Get()
  async getChatRooms() {
    return Object.keys(this.chatRooms).map((roomId) => ({
      roomId,
      participants: this.chatRooms[roomId].participants,
    })); // 채팅방 목록 반환
  }

  @ApiOperation({ summary: '특정 채팅방의 메시지 조회' })
  @ApiParam({ name: 'roomId', description: '채팅방 ID' })
  @Get(':roomId/messages')
  async getMessages(@Param('roomId') roomId: string) {
    const room = this.chatRooms[roomId];
    if (!room) {
      return { message: '채팅방을 찾을 수 없습니다.' };
    }
    return room.messages; // 메시지 반환
  }

  @ApiOperation({ summary: '채팅방에 메시지 전송' })
  @ApiParam({ name: 'roomId', description: '채팅방 ID' })
  @Post(':roomId/send')
  async sendMessage(@Param('roomId') roomId: string, @Body() sendMessageDto: SendMessageDto) {
    const room = this.chatRooms[roomId];
    if (!room) {
      return { message: '채팅방을 찾을 수 없습니다.' };
    }

    const newMessage = {
      id: `${Date.now()}`, // 메시지 ID 생성
      content: sendMessageDto.content,
      sender: sendMessageDto.senderId,
    };

    room.messages.push(newMessage); // 메시지 추가

    return newMessage; // 생성된 메시지 정보 반환
  }
}

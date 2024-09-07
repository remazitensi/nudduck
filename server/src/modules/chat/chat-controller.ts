import { Controller, Post, Get, Param, Body, Delete } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  @ApiOperation({ summary: '새로운 1대1 채팅방 생성' })
  @Post()
  createChatRoom(@Body() createChatDto: CreateChatDto) {
    // 구현 로직 추가
    return '채팅방 생성';
  }

  @ApiOperation({ summary: '특정 채팅방의 메시지 조회' })
  @ApiParam({ name: 'roomId', description: '채팅방 ID' })
  @Get(':roomId')
  getMessages(@Param('roomId') roomId: string) {
    // 구현 로직 추가
    return '메시지 조회';
  }

  @ApiOperation({ summary: '채팅방에 메시지 전송' })
  @ApiParam({ name: 'roomId', description: '채팅방 ID' })
  @Post(':roomId/send')
  sendMessage(
    @Param('roomId') roomId: string,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    // 구현 로직 추가
    return '메시지 전송'; // 예시 반환
  }

  @ApiOperation({ summary: '채팅 메시지 삭제' })
  @ApiParam({ name: 'roomId', description: '채팅방 ID' })
  @ApiParam({ name: 'messageId', description: '메시지 ID' })
  @Delete(':roomId/delete/:messageId')
  deleteMessage(
    @Param('roomId') roomId: string,
    @Param('messageId') messageId: string,
  ) {
    // 구현 로직 추가
    return '메시지 삭제';
  }
}

import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SessionMessageDto } from './dto/session-message.dto';

@ApiTags('Simulation')
@Controller('simulation')
export class SimulationController {
  
  @ApiOperation({ summary: 'AI와 의사소통 시뮬레이션 시작' })
  @Post()
  startSimulation() {
    return { message: 'AI 시뮬레이션 시작' };
  }

  @ApiOperation({ summary: '사용자의 이전 시뮬레이션 대화 기록 불러오기' })
  @Get('history')
  getSimulationHistory() {
    return { message: '이전 시뮬레이션 대화 기록' };
  }

  @ApiOperation({ summary: '특정 시뮬레이션 세션 기록 불러오기' })
  @Get('history/:sessionId')
  getSimulationSessionHistory(@Param('sessionId') sessionId: string) {
    return { message: `시뮬레이션 세션 ${sessionId} 기록` };
  }

  @ApiOperation({ summary: 'AI 시뮬레이션 세션에서 메시지 전송' })
  @Post(':sessionId/send')
  sendSimulationMessage(
    @Param('sessionId') sessionId: string,
    @Body() sessionMessageDto: SessionMessageDto,
  ) {
    return {
      message: `세션 ${sessionId}에 메시지 전송`,
      messageContent: sessionMessageDto.message,
    };
  }

  @ApiOperation({ summary: '시뮬레이션 세션 대화 기록 저장' })
  @Post(':sessionId/save')
  saveSimulationSession(@Param('sessionId') sessionId: string) {
    return { message: `세션 ${sessionId} 기록 저장 완료` };
  }
}

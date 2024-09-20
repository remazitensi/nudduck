/**
 * File Name    : simulation.controller.ts
 * Description  : ai simulation 컨트롤러 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.12    이승철      Created
 * 2024.09.16    이승철      Modified    절대경로 변경, ApiResponse 추가
 * 2024.09.19    이승철      Modified    ApiResponse 추가
 * 2024.09.21    이승철      Modified    swagger 데코레이터 재정렬
 */

import { Jwt } from '@_modules/auth/guards/jwt';
import { AIChatHistoryDto } from '@_modules/simulation/dto/ai-chat-history.dto';
import { AIChatResponseDto } from '@_modules/simulation/dto/ai-chat-response.dto';
import { AskAIDto } from '@_modules/simulation/dto/ask-ai.dto';
import { StartAIDto } from '@_modules/simulation/dto/start-ai.dto';
import { SimulationService } from '@_modules/simulation/simulation.service';
import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AIChatMessageDto } from './dto/ai-chat-message.dto';

@ApiTags('Simulation')
@Controller('simulation')
@UseGuards(Jwt)
export class SimulationController {
  constructor(private readonly simulationService: SimulationService) {}

  @ApiOperation({ summary: '유저의 채팅 세션 목록 조회' })
  @ApiResponse({ status: 200, description: '유저의 채팅 세션 목록을 성공적으로 반환', type: AIChatHistoryDto })
  @Get()
  async getUserHistory(@Req() req): Promise<AIChatHistoryDto> {
    const userId = req.user.id;
    const history = await this.simulationService.getUserSessions(userId);
    return { history };
  }

  @ApiOperation({ summary: '특정 채팅 세션의 대화 기록 조회' })
  @ApiParam({ name: 'sessionId', description: '조회할 채팅 세션 ID', example: 1 })
  @ApiResponse({ status: 200, description: '특정 세션의 대화 기록을 성공적으로 반환', type: AIChatMessageDto })
  @ApiResponse({ status: 404, description: '해당 세션을 찾을 수 없습니다.' })
  @Get('/:sessionId')
  async getSessionHistory(@Param('sessionId') sessionId: number): Promise<AIChatMessageDto> {
    const messages = await this.simulationService.getSessionHistory(sessionId);
    return { messages };
  }

  @ApiOperation({ summary: '유저가 채팅방에 들어올 때, 이전 세션 이어받기 또는 새 세션 시작' })
  @ApiBody({ type: StartAIDto, description: '새 세션 시작 여부를 포함한 요청 데이터' })
  @ApiResponse({ status: 200, description: '새로운 세션을 성공적으로 시작하거나 기존 세션을 반환', schema: { example: { sessionId: 1 } } })
  @ApiResponse({ status: 400, description: '요청이 잘못되었습니다.' })
  @Post('start-chat')
  async startChat(@Body() startAIDto: StartAIDto, @Req() req): Promise<{ sessionId: number }> {
    const userId = req.user.id;
    const session = await this.simulationService.handleSession(userId, startAIDto.isNewChat);
    return { sessionId: session.id };
  }

  @ApiOperation({ summary: '유저가 AI에게 질문을 던지면, AI 응답 생성 후 실시간 저장' })
  @ApiBody({ type: AskAIDto, description: 'AI 질문 및 세션 정보 요청 데이터' })
  @ApiResponse({ status: 200, description: '유저 질문과 AI 응답을 성공적으로 처리하고 실시간으로 저장', type: AIChatResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 요청입니다.' })
  @Post('ask')
  async askAI(@Body() askAIDto: AskAIDto): Promise<AIChatResponseDto> {
    const aiResponse = await this.simulationService.getAIResponse(askAIDto.query);

    // 유저 질문과 AI 응답을 실시간으로 저장
    await this.simulationService.createUserMessage(askAIDto.sessionId, askAIDto.query);
    await this.simulationService.createAIMessage(askAIDto.sessionId, aiResponse.Answer);

    return {
      query: askAIDto.query,
      answer: aiResponse.Answer,
    };
  }
}

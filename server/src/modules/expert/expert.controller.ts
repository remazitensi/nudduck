/**
 * File Name    : expert.controller.ts
 * Description  : expert 컨트롤러 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.14    이승철      Created
 * 2024.09.14    이승철      Modified    ApiResponse 추가
 * 2024.09.16    이승철      Modified    절대경로 변경
 */

import { ExpertPageDto } from '@_modules/expert/dto/expert-page.dto';
import { Expert } from '@_modules/expert/entity/expert.entity';
import { ExpertService } from '@_modules/expert/expert.service';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Expert')
@Controller('expert')
export class ExpertController {
  constructor(private readonly expertService: ExpertService) {}

  @ApiOperation({ summary: '전문가 리스트 조회', description: '페이지네이션을 적용한 전문가 리스트를 조회합니다.' })
  @ApiResponse({
    status: 200,
    description: '성공적으로 전문가 리스트를 반환합니다.',
    schema: {
      example: {
        data: [
          {
            id: 1,
            name: 'lsiron',
            jobTitle: '갈등 해결 컨설턴트',
            age: 20,
            bio: '10년 경력의 의사소통 전문가로, 팀 내 갈등 해결 및 대인관계 개선을 전문으로 합니다.',
            profileImage: 'https://nuduck.s3.ap-northeast-2.amazonaws.com/1.PNG',
            email: 'lsiron@example.com',
            phone: '010-1234-5678',
            cost: 80000,
            hashtags: '의사소통,팀 갈등,대인관계',
          },
        ],
        totalCount: 100,
      },
    },
  })
  @Get()
  async getExperts(@Query() expertPageDto: ExpertPageDto): Promise<{ data: Expert[]; totalCount: number }> {
    const limit = 10; // 페이지 당 10개의 데이터 고정
    return this.expertService.getExperts(expertPageDto.page, limit);
  }

  @ApiOperation({ summary: '전문가 상세 조회', description: '특정 전문가의 상세 정보를 조회합니다.' })
  @ApiParam({ name: 'id', description: '전문가 ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '성공적으로 전문가 상세 정보를 반환합니다.',
    schema: {
      example: {
        id: 1,
        name: 'lsiron',
        jobTitle: '갈등 해결 컨설턴트',
        age: 20,
        bio: '10년 경력의 의사소통 전문가로, 팀 내 갈등 해결 및 대인관계 개선을 전문으로 합니다.',
        profileImage: 'https://nuduck.s3.ap-northeast-2.amazonaws.com/1.PNG',
        email: 'lsiron@example.com',
        phone: '010-1234-5678',
        cost: 80000,
        hashtags: '의사소통,팀 갈등,대인관계',
      },
    },
  })
  @Get(':id')
  async getExpertById(@Param('id') id: number): Promise<Expert> {
    return this.expertService.getExpertById(id);
  }
}

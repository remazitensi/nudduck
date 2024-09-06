import { Controller, Get, Post, Delete, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HashtagsDto } from './dto/hashtags.dto';

@ApiTags('User Management')
@Controller('my')
export class UserController {
  @ApiOperation({ summary: '프로필 조회' })
  @Get()
  getProfile() {
    return { message: '프로필 정보 조회' };
  }

  @ApiOperation({ summary: '해시태그 추가' })
  @Post('create-hashtags')
  createHashtags(@Body() hashtagsDto: HashtagsDto) {
    return { message: '해시태그 추가', hashtags: hashtagsDto.hashtags };
  }

  @ApiOperation({ summary: '해시태그 삭제' })
  @Delete('delete-hashtags')
  deleteHashtags(@Body() hashtagsDto: HashtagsDto) {
    return { message: '해시태그 삭제', hashtags: hashtagsDto.hashtags };
  }

  @ApiOperation({ summary: '프로필 이미지 업로드' })
  @Post('upload-image')
  uploadImage() {
    return { message: '프로필 이미지 업로드' };
  }

  @ApiOperation({ summary: '프로필 이미지 삭제' })
  @Delete('delete-image')
  deleteImage() {
    return { message: '프로필 이미지 삭제' };
  }

  @ApiOperation({ summary: '계정 탈퇴' })
  @Delete('delete-account')
  deleteAccount() {
    return { message: '계정 탈퇴' };
  }
}

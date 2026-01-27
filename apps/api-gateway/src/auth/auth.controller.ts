import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('register')
  @ApiOperation({ summary: '회원가입', description: '새로운 사용자를 등록합니다.' })
  @ApiResponse({ status: 201, description: '회원가입이 성공적으로 완료되었습니다.' })
  @ApiResponse({ status: 409, description: '이미 존재하는 이메일입니다.' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: '로그인', description: '사용자 로그인을 처리합니다.' })
  @ApiResponse({ status: 200, description: '로그인이 성공적으로 완료되었습니다.' })
  @ApiResponse({ status: 401, description: '인증 정보가 올바르지 않습니다.' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '프로필 조회', description: '현재 로그인한 사용자의 프로필을 조회합니다.' })
  @ApiResponse({ status: 200, description: '프로필 조회 성공' })
  @ApiResponse({ status: 401, description: '인증되지 않은 사용자입니다.' })
  async getProfile(@Request() req: { user: { userId: number } }) {
    return this.authService.getProfile(req.user.userId);
  }
}

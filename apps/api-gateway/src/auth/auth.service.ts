import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

// 간단한 인메모리 사용자 저장소 (실제로는 DB 사용)
interface User {
  id: number;
  email: string;
  name: string;
  password: string;
}

@Injectable()
export class AuthService {
  private users: User[] = [];
  private userIdCounter = 1;

  constructor(private jwtService: JwtService) {}

  async register(registerDto: RegisterDto) {
    // 이메일 중복 확인
    const existingUser = this.users.find(
      (user) => user.email === registerDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // 사용자 생성
    const user: User = {
      id: this.userIdCounter++,
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
    };

    this.users.push(user);

    // JWT 토큰 생성
    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      access_token: token,
    };
  }

  async login(loginDto: LoginDto) {
    // 사용자 찾기
    const user = this.users.find((user) => user.email === loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // JWT 토큰 생성
    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      access_token: token,
    };
  }

  async getProfile(userId: number) {
    const user = this.users.find((user) => user.id === userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    return this.jwtService.sign(payload);
  }
}

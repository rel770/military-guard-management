import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(loginDto: LoginDto) {
    // Mock login - will be implemented with real validation later
    const payload = { email: loginDto.email, sub: 1, role: 'soldier' };
    return {
      access_token: this.jwtService.sign(payload),
      user: { email: loginDto.email, role: 'soldier' },
    };
  }

  async register(registerDto: RegisterDto) {
    // Mock registration - will be implemented with real user creation later
    const payload = {
      email: registerDto.email,
      sub: 1,
      role: registerDto.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: { email: registerDto.email, role: registerDto.role },
    };
  }
}

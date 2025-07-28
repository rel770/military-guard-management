import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(loginDto: LoginDto) {
    // Mock login - will be implemented with real validation later
    const payload = { email: loginDto.email, sub: 1, role: 'soldier' };
    return {
      access_token: this.jwtService.sign(payload),
      user: { email: loginDto.email, role: 'soldier' }
    };
  }
}

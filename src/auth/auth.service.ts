import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(loginDto: LoginDto) {
    // Find user by email
    const user = this.usersService.findUserForAuth(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    if (this.usersService.findByEmail(registerDto.email)) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = process.env.BCRYPT_SALT_ROUNDS || 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    // Create user
    const newUser = this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    // Generate JWT token
    const payload = {
      email: newUser.email,
      sub: newUser.id,
      role: newUser.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: newUser,
    };
  }
}

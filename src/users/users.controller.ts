import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return {
      message: 'Mock: Get all users',
      data: [
        { id: 1, name: 'John Soldier', role: 'soldier' },
        { id: 2, name: 'John Commander', role: 'commander' },
      ],
    };
  }

  @Get('profile')
  getProfile() {
    return {
      message: 'Mock: Get user profile',
      data: { id: 1, name: 'Current User', role: 'soldier' },
    };
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return {
      message: 'Mock: User created successfully',
      data: { id: 3, ...createUserDto },
    };
  }
}

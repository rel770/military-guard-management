import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
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

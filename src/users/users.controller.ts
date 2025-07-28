import { Controller, Get } from '@nestjs/common';

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
}

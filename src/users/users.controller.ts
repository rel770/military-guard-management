import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UsersService } from './users.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.COMMANDER)
  findAll() {
    return {
      message: 'All users retrieved successfully',
      data: this.usersService.findAll(),
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

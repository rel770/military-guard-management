import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UsersService } from './users.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.COMMANDER)
  async findAll() {
    return {
      message: 'All users retrieved successfully',
      data: await this.usersService.findAll(),
    };
  }

  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    return {
      message: 'User profile retrieved successfully',
      data: user,
    };
  }

  @Post()
  @Roles(Role.COMMANDER)
  async create(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersService.create(createUserDto);
    return {
      message: 'User created successfully',
      data: newUser,
    };
  }
}

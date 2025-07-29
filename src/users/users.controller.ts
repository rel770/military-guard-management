import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
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
  getProfile(@Request() req) {
    const user = this.usersService.findById(req.user.userId);
    return {
      message: 'User profile retrieved successfully',
      data: user,
    };
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const newUser = this.usersService.create(createUserDto);
    return {
      message: 'User created successfully',
      data: newUser,
    };
  }
}

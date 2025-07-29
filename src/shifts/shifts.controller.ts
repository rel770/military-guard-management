import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ShiftsService } from './shifts.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('shifts')
@UseGuards(JwtAuthGuard)
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Get()
  findAll() {
    return {
      message: 'All shifts retrieved successfully',
      data: this.shiftsService.findAll(),
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const shift = this.shiftsService.findById(+id);
    return {
      message: 'Shift retrieved successfully',
      data: shift,
    };
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.COMMANDER)
  create(@Body() shiftData: any) {
    const newShift = this.shiftsService.create(shiftData);
    return {
      message: 'Shift created successfully',
      data: newShift,
    };
  }
}

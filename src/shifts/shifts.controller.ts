import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ShiftsService } from './shifts.service';

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
  create(@Body() createShiftDto: any) {
    return {
      message: 'Mock: Shift created successfully',
      data: { id: 3, ...createShiftDto },
    };
  }
}

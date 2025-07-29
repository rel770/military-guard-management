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
    return {
      message: `Mock: Get shift ${id}`,
      data: {
        id: parseInt(id),
        startTime: '2025-07-28T08:00:00Z',
        endTime: '2025-07-28T16:00:00Z',
        location: 'Main Gate',
      },
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

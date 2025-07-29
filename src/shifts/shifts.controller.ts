import { Controller, Get, Param, Post, Body } from '@nestjs/common';

@Controller('shifts')
export class ShiftsController {
  @Get()
  findAll() {
    return {
      message: 'Mock: Get all shifts',
      data: [
        {
          id: 1,
          startTime: '2025-07-28T08:00:00Z',
          endTime: '2025-07-28T16:00:00Z',
          location: 'Main Gate',
        },
        {
          id: 2,
          startTime: '2025-07-28T16:00:00Z',
          endTime: '2025-07-29T00:00:00Z',
          location: 'Perimeter',
        },
      ],
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

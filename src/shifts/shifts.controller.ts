import { Controller, Get } from '@nestjs/common';

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
}

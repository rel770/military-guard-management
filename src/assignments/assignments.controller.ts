import { Controller, Get } from '@nestjs/common';

@Controller('assignments')
export class AssignmentsController {
  @Get()
  findAll() {
    return {
      message: 'Mock: Get all assignments',
      data: [
        {
          id: 1,
          userId: 1,
          shiftId: 1,
          user: { name: 'John Soldier' },
          shift: { location: 'Main Gate', startTime: '2025-07-28T08:00:00Z' },
        },
        {
          id: 2,
          userId: 2,
          shiftId: 2,
          user: { name: 'Jane Commander' },
          shift: { location: 'Perimeter', startTime: '2025-07-28T16:00:00Z' },
        },
      ],
    };
  }
}

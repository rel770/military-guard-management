import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AssignmentsService } from './assignments.service';

@Controller('assignments')
@UseGuards(JwtAuthGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

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

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return {
      message: `Mock: Get assignments for user ${userId}`,
      data: [
        {
          id: 1,
          userId: parseInt(userId),
          shiftId: 1,
          shift: { location: 'Main Gate', startTime: '2025-07-28T08:00:00Z' },
        },
      ],
    };
  }

  @Post()
  create(@Body() createAssignmentDto: any) {
    return {
      message: 'Mock: Assignment created successfully',
      data: { id: 3, ...createAssignmentDto },
    };
  }
}

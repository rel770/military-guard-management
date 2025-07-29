import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AssignmentsService } from './assignments.service';

@Controller('assignments')
@UseGuards(JwtAuthGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  findAll(@Request() req) {
    // Use role-based filtering
    const assignments = this.assignmentsService.findAssignmentsForUser(
      req.user.userId,
      req.user.role,
    );
    return {
      message: 'Assignments retrieved successfully',
      data: assignments,
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

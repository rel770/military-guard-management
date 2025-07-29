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
  @UseGuards(RolesGuard)
  @Roles(Role.COMMANDER)
  findByUser(@Param('userId') userId: string) {
    const assignments = this.assignmentsService.findByUserId(+userId);
    return {
      message: 'User assignments retrieved successfully',
      data: assignments,
    };
  }

  @Get('shift/:shiftId')
  @UseGuards(RolesGuard)
  @Roles(Role.COMMANDER)
  findByShift(@Param('shiftId') shiftId: string) {
    const assignments = this.assignmentsService.findByShiftId(+shiftId);
    return {
      message: 'Shift assignments retrieved successfully',
      data: assignments,
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

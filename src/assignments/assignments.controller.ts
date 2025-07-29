import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AssignmentsService } from './assignments.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

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
  @UseGuards(RolesGuard)
  @Roles(Role.COMMANDER)
  create(
    @Body() assignmentData: { userId: number; shiftId: number },
    @Request() req,
  ) {
    const newAssignment = this.assignmentsService.create(
      assignmentData.userId,
      assignmentData.shiftId,
      req.user.userId,
    );
    return {
      message: 'Assignment created successfully',
      data: newAssignment,
    };
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.COMMANDER)
  updateStatus(
    @Param('id') id: string,
    @Body() statusData: { status: string },
  ) {
    const updatedAssignment = this.assignmentsService.updateStatus(
      +id,
      statusData.status as any,
    );
    return {
      message: 'Assignment status updated successfully',
      data: updatedAssignment,
    };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.COMMANDER)
  delete(@Param('id') id: string) {
    this.assignmentsService.delete(+id);
    return {
      message: 'Assignment deleted successfully',
    };
  }
}

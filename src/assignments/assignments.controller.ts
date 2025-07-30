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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssignmentsService } from './assignments.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CreateAssignmentDto } from './dto/create-assignment.dto';

@Controller('assignments')
@UseGuards(JwtAuthGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  async findAll(@Request() req) {
    // Use role-based filtering
    const assignments = await this.assignmentsService.findAssignmentsForUser(
      req.user.userId,
      req.user.role,
    );
    
    // Convert to API response format
    return {
      message: 'Assignments retrieved successfully',
      data: assignments.map(assignment => assignment.toResponse()),
    };
  }

  @Get('user/:userId')
  @UseGuards(RolesGuard)
  @Roles(Role.COMMANDER)
  async findByUser(@Param('userId') userId: string) {
    const assignments = await this.assignmentsService.findByUserId(+userId);
    return {
      message: 'User assignments retrieved successfully',
      data: assignments.map(assignment => assignment.toResponse()),
    };
  }

  @Get('shift/:shiftId')
  @UseGuards(RolesGuard)
  @Roles(Role.COMMANDER)
  async findByShift(@Param('shiftId') shiftId: string) {
    const assignments = await this.assignmentsService.findByShiftId(+shiftId);
    return {
      message: 'Shift assignments retrieved successfully',
      data: assignments.map(assignment => assignment.toResponse()),
    };
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.COMMANDER)
  async create(
    @Body() assignmentData: CreateAssignmentDto,
    @Request() req,
  ) {
    const newAssignment = await this.assignmentsService.create(
      assignmentData.userId,
      assignmentData.shiftId,
      req.user.userId,
    );
    return {
      message: 'Assignment created successfully',
      data: newAssignment.toResponse(),
    };
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.COMMANDER)
  async updateStatus(
    @Param('id') id: string,
    @Body() statusData: { status: string },
  ) {
    const updatedAssignment = await this.assignmentsService.updateStatus(
      +id,
      statusData.status as any,
    );
    return {
      message: 'Assignment status updated successfully',
      data: updatedAssignment.toResponse(),
    };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.COMMANDER)
  async delete(@Param('id') id: string) {
    await this.assignmentsService.delete(+id);
    return {
      message: 'Assignment deleted successfully',
    };
  }
}

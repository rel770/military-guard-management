import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '../common/enums/role.enum';
import { DatabaseService } from '../database/database.service';
import { Assignment } from './entities/assignment.entity';

@Injectable()
export class AssignmentsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<Assignment[]> {
    const result = await this.databaseService.query(
      'SELECT * FROM assignments ORDER BY assigned_at DESC'
    );
    return result.rows.map(row => Assignment.fromDatabase(row));
  }

  async findByUserId(userId: number): Promise<Assignment[]> {
    const result = await this.databaseService.query(
      'SELECT * FROM assignments WHERE user_id = $1 ORDER BY assigned_at DESC',
      [userId]
    );
    return result.rows.map(row => Assignment.fromDatabase(row));
  }

  async findByShiftId(shiftId: number): Promise<Assignment[]> {
    const result = await this.databaseService.query(
      'SELECT * FROM assignments WHERE shift_id = $1 ORDER BY assigned_at DESC',
      [shiftId]
    );
    return result.rows.map(row => Assignment.fromDatabase(row));
  }

  async findById(id: number): Promise<Assignment> {
    const result = await this.databaseService.query(
      'SELECT * FROM assignments WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }
    
    return Assignment.fromDatabase(result.rows[0]);
  }

  create(userId: number, shiftId: number, assignedBy: number): Assignment {
    // Check if user is already assigned to this shift
    const existingAssignment = this.assignments.find(
      (a) =>
        a.userId === userId && a.shiftId === shiftId && a.status === 'assigned',
    );

    if (existingAssignment) {
      throw new ConflictException('User is already assigned to this shift');
    }

    const newAssignment: Assignment = {
      id: this.assignments.length + 1,
      userId,
      shiftId,
      status: 'assigned',
      assignedAt: new Date(),
      assignedBy,
    };

    this.assignments.push(newAssignment);
    return newAssignment;
  }

  updateStatus(id: number, status: Assignment['status']): Assignment {
    const assignmentIndex = this.assignments.findIndex((a) => a.id === id);
    if (assignmentIndex === -1) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    this.assignments[assignmentIndex].status = status;
    return this.assignments[assignmentIndex];
  }

  delete(id: number): void {
    const assignmentIndex = this.assignments.findIndex((a) => a.id === id);
    if (assignmentIndex === -1) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    this.assignments.splice(assignmentIndex, 1);
  }

  // Helper method to get assignments with user role filtering
  findAssignmentsForUser(userId: number, userRole: Role): Assignment[] {
    if (userRole === Role.COMMANDER) {
      // Commanders can see all assignments
      return this.assignments;
    } else {
      // Soldiers can only see their own assignments
      return this.assignments.filter((a) => a.userId === userId);
    }
  }
}

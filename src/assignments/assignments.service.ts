import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '../common/enums/role.enum';
import { DatabaseService } from '../database/database.service';
import { Assignment } from './entities/assignment.entity';

@Injectable()
export class AssignmentsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<Assignment[]> {
    const result = await this.databaseService.query(
      'SELECT * FROM assignments ORDER BY assigned_at DESC',
    );
    return result.rows.map((row) => Assignment.fromDatabase(row));
  }

  async findByUserId(userId: number): Promise<Assignment[]> {
    const result = await this.databaseService.query(
      'SELECT * FROM assignments WHERE user_id = $1 ORDER BY assigned_at DESC',
      [userId],
    );
    return result.rows.map((row) => Assignment.fromDatabase(row));
  }

  async findByShiftId(shiftId: number): Promise<Assignment[]> {
    const result = await this.databaseService.query(
      'SELECT * FROM assignments WHERE shift_id = $1 ORDER BY assigned_at DESC',
      [shiftId],
    );
    return result.rows.map((row) => Assignment.fromDatabase(row));
  }

  async findById(id: number): Promise<Assignment> {
    const result = await this.databaseService.query(
      'SELECT * FROM assignments WHERE id = $1',
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Assignment with ID ${id} was not found`);
    }

    return Assignment.fromDatabase(result.rows[0]);
  }

  async create(
    userId: number,
    shiftId: number,
    assignedBy: number,
  ): Promise<Assignment> {
    // Verify user exists
    const userCheck = await this.databaseService.query(
      'SELECT id FROM users WHERE id = $1',
      [userId],
    );
    if (userCheck.rows.length === 0) {
      throw new NotFoundException(`User with ID ${userId} was not found`);
    }

    // Verify shift exists
    const shiftCheck = await this.databaseService.query(
      'SELECT id FROM shifts WHERE id = $1',
      [shiftId],
    );
    if (shiftCheck.rows.length === 0) {
      throw new NotFoundException(`Shift with ID ${shiftId} was not found`);
    }

    // Check if user is already assigned to this shift
    const existingResult = await this.databaseService.query(
      'SELECT * FROM assignments WHERE user_id = $1 AND shift_id = $2 AND status = $3',
      [userId, shiftId, 'assigned'],
    );

    if (existingResult.rows.length > 0) {
      throw new ConflictException('The user is already assigned to this shift');
    }

    const result = await this.databaseService.query(
      'INSERT INTO assignments (user_id, shift_id, status, assigned_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, shiftId, 'assigned', assignedBy],
    );

    return Assignment.fromDatabase(result.rows[0]);
  }

  async updateStatus(
    id: number,
    status: 'assigned' | 'completed' | 'cancelled',
  ): Promise<Assignment> {
    const result = await this.databaseService.query(
      'UPDATE assignments SET status = $1 WHERE id = $2 RETURNING *',
      [status, id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Assignment with ID ${id} was not found`);
    }

    return Assignment.fromDatabase(result.rows[0]);
  }

  async delete(id: number): Promise<void> {
    const result = await this.databaseService.query(
      'DELETE FROM assignments WHERE id = $1 RETURNING id',
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Assignment with ID ${id} was not found`);
    }
  }

  // Helper method to get assignments with user role filtering
  async findAssignmentsForUser(
    userId: number,
    userRole: Role,
  ): Promise<Assignment[]> {
    if (userRole === Role.COMMANDER) {
      // Commanders can see all assignments
      return this.findAll();
    } else {
      // Soldiers can only see their own assignments
      return this.findByUserId(userId);
    }
  }
}

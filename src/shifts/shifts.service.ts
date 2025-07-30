import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Shift } from './entities/shift.entity';

export interface CreateShiftDto {
  startTime: Date;
  endTime: Date;
  location: string;
  description?: string;
}

export interface UpdateShiftDto {
  startTime?: Date;
  endTime?: Date;
  location?: string;
  description?: string;
}

@Injectable()
export class ShiftsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<Shift[]> {
    try {
      const query = 'SELECT * FROM shifts ORDER BY start_time ASC';
      const result = await this.databaseService.query(query, []);
      return result.rows.map(row => Shift.fromDatabase(row));
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<Shift> {
    try {
      const query = 'SELECT * FROM shifts WHERE id = $1';
      const result = await this.databaseService.query(query, [id]);
      
      if (result.rows.length === 0) {
        throw new NotFoundException(`Shift with ID ${id} not found`);
      }
      
      return Shift.fromDatabase(result.rows[0]);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Database query error:', error);
      throw error;
    }
  }

  async create(shiftData: CreateShiftDto): Promise<Shift> {
    try {
      const shift = new Shift({
        start_time: shiftData.startTime,
        end_time: shiftData.endTime,
        location: shiftData.location,
        description: shiftData.description,
      });

      const dbData = shift.toDatabase();
      const query = `
        INSERT INTO shifts (start_time, end_time, location, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      
      const result = await this.databaseService.query(query, [
        dbData.start_time,
        dbData.end_time,
        dbData.location,
        dbData.description,
      ]);
      
      return Shift.fromDatabase(result.rows[0]);
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }
}

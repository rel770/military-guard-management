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

}

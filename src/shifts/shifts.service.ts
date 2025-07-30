import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Shift } from './entities/shift.entity';

export interface Shift {
  id: number;
  startTime: Date;
  endTime: Date;
  location: string;
  description?: string;
  createdAt: Date;
}

@Injectable()
export class ShiftsService {
  constructor(private readonly databaseService: DatabaseService) {}

}

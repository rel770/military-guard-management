import { Injectable } from '@nestjs/common';

interface Shift {
  id: number;
  startTime: Date;
  endTime: Date;
  location: string;
  description?: string;
  createdAt: Date;
}

@Injectable()
export class ShiftsService {}

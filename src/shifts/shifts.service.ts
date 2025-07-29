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
export class ShiftsService {
  private shifts: Shift[] = [
    {
      id: 1,
      startTime: new Date('2025-01-30T06:00:00'),
      endTime: new Date('2025-01-30T14:00:00'),
      location: 'Main Gate',
      description: 'Morning shift at main entrance',
      createdAt: new Date(),
    },
    {
      id: 2,
      startTime: new Date('2025-01-30T14:00:00'),
      endTime: new Date('2025-01-30T22:00:00'),
      location: 'Perimeter',
      description: 'Afternoon perimeter patrol',
      createdAt: new Date(),
    },
    {
      id: 3,
      startTime: new Date('2025-01-30T22:00:00'),
      endTime: new Date('2025-01-31T06:00:00'),
      location: 'Control Room',
      description: 'Night shift monitoring',
      createdAt: new Date(),
    },
  ];

  findAll(): Shift[] {
    return this.shifts;
  }
}

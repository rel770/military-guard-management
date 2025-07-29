import { Injectable, NotFoundException } from '@nestjs/common';

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

  findById(id: number): Shift {
    const shift = this.shifts.find(s => s.id === id);
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }
    return shift;
  }

  create(shiftData: Omit<Shift, 'id' | 'createdAt'>): Shift {
    const newShift: Shift = {
      id: this.shifts.length + 1,
      ...shiftData,
      createdAt: new Date(),
    };

    this.shifts.push(newShift);
    return newShift;
  }

  update(id: number, updateData: Partial<Omit<Shift, 'id' | 'createdAt'>>): Shift {
    const shiftIndex = this.shifts.findIndex(s => s.id === id);
    if (shiftIndex === -1) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }

    this.shifts[shiftIndex] = { ...this.shifts[shiftIndex], ...updateData };
    return this.shifts[shiftIndex];
  }
}

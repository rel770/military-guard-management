import { Injectable } from '@nestjs/common';

interface Assignment {
  id: number;
  userId: number;
  shiftId: number;
  status: 'assigned' | 'completed' | 'cancelled';
  assignedAt: Date;
  assignedBy: number; // ID of the commander who made the assignment
}

@Injectable()
export class AssignmentsService {
  private assignments: Assignment[] = [
    {
      id: 1,
      userId: 1, // John Soldier
      shiftId: 1, // Main Gate morning shift
      status: 'assigned',
      assignedAt: new Date(),
      assignedBy: 2, // John Commander
    },
    {
      id: 2,
      userId: 1, // John Soldier
      shiftId: 2, // Perimeter afternoon shift
      status: 'completed',
      assignedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      assignedBy: 2, // John Commander
    },
  ];

  findAll(): Assignment[] {
    return this.assignments;
  }

  findByUserId(userId: number): Assignment[] {
    return this.assignments.filter((a) => a.userId === userId);
  }
}

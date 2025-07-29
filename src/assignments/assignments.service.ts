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
export class AssignmentsService {}

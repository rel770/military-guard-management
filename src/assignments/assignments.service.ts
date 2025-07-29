import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from 'src/common/enums/role.enum';

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

  findByShiftId(shiftId: number): Assignment[] {
    return this.assignments.filter((a) => a.shiftId === shiftId);
  }

  findById(id: number): Assignment {
    const assignment = this.assignments.find((a) => a.id === id);
    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }
    return assignment;
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

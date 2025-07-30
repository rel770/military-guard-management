export type AssignmentStatus = 'assigned' | 'completed' | 'cancelled';

export class Assignment {
  id: number;
  user_id: number;
  shift_id: number;
  status: AssignmentStatus;
  assigned_at: Date;
  assigned_by: number;

  constructor(partial: Partial<Assignment>) {
    Object.assign(this, partial);
  }

  // Method to convert to database format (snake_case)
  toDatabase() {
    return {
      user_id: this.user_id,
      shift_id: this.shift_id,
      status: this.status,
      assigned_by: this.assigned_by,
    };
  }

  // Static method to create from database format
  static fromDatabase(dbAssignment: any): Assignment {
    return new Assignment({
      id: dbAssignment.id,
      user_id: dbAssignment.user_id,
      shift_id: dbAssignment.shift_id,
      status: dbAssignment.status as AssignmentStatus,
      assigned_at: new Date(dbAssignment.assigned_at),
      assigned_by: dbAssignment.assigned_by,
    });
  }

  // Method for API response (camelCase)
  toResponse() {
    return {
      id: this.id,
      userId: this.user_id,
      shiftId: this.shift_id,
      status: this.status,
      assignedAt: this.assigned_at,
      assignedBy: this.assigned_by,
    };
  }
}

export class Shift {
  id: number;
  start_time: Date;
  end_time: Date;
  location: string;
  description?: string;
  created_at: Date;

  constructor(partial: Partial<Shift>) {
    Object.assign(this, partial);
  }

  // Method to convert to database format (snake_case)
  toDatabase() {
    return {
      start_time: this.start_time,
      end_time: this.end_time,
      location: this.location,
      description: this.description,
    };
  }

  // Static method to create from database format
  static fromDatabase(dbShift: any): Shift {
    return new Shift({
      id: dbShift.id,
      start_time: new Date(dbShift.start_time),
      end_time: new Date(dbShift.end_time),
      location: dbShift.location,
      description: dbShift.description,
      created_at: new Date(dbShift.created_at),
    });
  }

  // Method for API response (camelCase)
  toResponse() {
    return {
      id: this.id,
      startTime: this.start_time,
      endTime: this.end_time,
      location: this.location,
      description: this.description,
      createdAt: this.created_at,
    };
  }
}

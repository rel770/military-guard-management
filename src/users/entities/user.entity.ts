import { Role } from '../../common/enums/role.enum';

export class User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
  created_at: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  // Method to convert to database format (snake_case)
  toDatabase() {
    return {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
    };
  }

  // Static method to create from database format
  static fromDatabase(dbUser: any): User {
    return new User({
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      password: dbUser.password,
      role: dbUser.role as Role,
      created_at: dbUser.created_at,
    });
  }

  // Method to exclude password from response
  toSafeObject() {
    const { password, ...safeUser } = this;
    return safeUser;
  }
}

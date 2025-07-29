import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '../common/enums/role.enum';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
}

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 1,
      name: 'John Soldier',
      email: 'soldier@domain.com',
      password: 'hashedPassword123', // In the future, this will be a bcrypt hash
      role: Role.SOLDIER,
      createdAt: new Date(),
    },
    {
      id: 2,
      name: 'John Commander',
      email: 'commander@domain.com',
      password: 'hashedPassword456', // In the future, this will be a bcrypt hash
      role: Role.COMMANDER,
      createdAt: new Date(),
    },
  ];

  findAll(): Omit<User, 'password'>[] {
    return this.users.map(({ password, ...user }) => user);
  }

  findById(id: number): Omit<User, 'password'> | null {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  findByEmail(email: string): User | null {
    return this.users.find((u) => u.email === email) || null;
  }
}

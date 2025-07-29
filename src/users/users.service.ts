import { Injectable } from '@nestjs/common';
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
}

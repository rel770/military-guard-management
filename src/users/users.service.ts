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
export class UsersService {}

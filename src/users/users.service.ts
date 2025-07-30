import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async findAll(): Promise<User[]> {
    const result = await this.databaseService.query('SELECT * FROM users');
    return result.map((row) => User.fromDatabase(row));
  }

  async findById(id: number): Promise<User | null> {
    const result = await this.databaseService.query(
      'SELECT * FROM users WHERE id = $1',
      [id],
    );
    return result.length > 0 ? User.fromDatabase(result[0]) : null;
  }

  findByEmail(email: string): User | null {
    return this.users.find((u) => u.email === email) || null;
  }

  create(createUserDto: CreateUserDto): Omit<User, 'password'> {
    // Check if user already exists
    if (this.findByEmail(createUserDto.email)) {
      throw new ConflictException('User with this email already exists');
    }

    const newUser: User = {
      id: this.users.length + 1,
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      role: createUserDto.role as Role,
      createdAt: new Date(),
    };

    this.users.push(newUser);
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  // Helper method for authentication
  findUserForAuth(email: string): User | null {
    return this.users.find((u) => u.email === email) || null;
  }
}

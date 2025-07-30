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
    return result.rows.map((row) => User.fromDatabase(row));
  }

  async findById(id: number): Promise<User | null> {
    const result = await this.databaseService.query(
      'SELECT * FROM users WHERE id = $1',
      [id],
    );
    return result.rows.length > 0 ? User.fromDatabase(result.rows[0]) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.databaseService.query(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );
    return result.rows.length > 0 ? User.fromDatabase(result.rows[0]) : null;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = new User({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      role: createUserDto.role,
    });

    const userData = user.toDatabase();

    const result = await this.databaseService.query(
      `INSERT INTO users (name, email, password, role) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userData.name, userData.email, userData.password, userData.role],
    );

    return User.fromDatabase(result.rows[0]);
  }
}

import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateAssignmentDto {
  @IsNotEmpty({ message: 'User ID is required' })
  @IsNumber({}, { message: 'User ID must be a number' })
  @IsPositive({ message: 'User ID must be a positive number' })
  userId: number;

  @IsNotEmpty({ message: 'Shift ID is required' })
  @IsNumber({}, { message: 'Shift ID must be a number' })
  @IsPositive({ message: 'Shift ID must be a positive number' })
  shiftId: number;
}

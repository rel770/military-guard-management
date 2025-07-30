import { IsNotEmpty, IsIn } from 'class-validator';

export class UpdateAssignmentStatusDto {
  @IsNotEmpty({ message: 'Status is required' })
  @IsIn(['assigned', 'completed', 'cancelled'], {
    message: 'Status must be: assigned, completed or cancelled',
  })
  status: 'assigned' | 'completed' | 'cancelled';
}

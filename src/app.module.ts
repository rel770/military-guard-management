import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ShiftsModule } from './shifts/shifts.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [UsersModule, AuthModule, ShiftsModule, AssignmentsModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

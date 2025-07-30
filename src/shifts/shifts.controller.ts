import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ShiftsService, CreateShiftDto, UpdateShiftDto } from './shifts.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('shifts')
@UseGuards(JwtAuthGuard)
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Get()
  async findAll() {
    const shifts = await this.shiftsService.findAll();
    return {
      message: 'All shifts retrieved successfully',
      data: shifts.map(shift => shift.toResponse()),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const shift = await this.shiftsService.findById(+id);
    return {
      message: 'Shift retrieved successfully',
      data: shift.toResponse(),
    };
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.COMMANDER)
  async create(@Body() shiftData: CreateShiftDto) {
    const newShift = await this.shiftsService.create(shiftData);
    return {
      message: 'Shift created successfully',
      data: newShift.toResponse(),
    };
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.COMMANDER)
  async update(@Param('id') id: string, @Body() updateData: UpdateShiftDto) {
    const updatedShift = await this.shiftsService.update(+id, updateData);
    return {
      message: 'Shift updated successfully',
      data: updatedShift.toResponse(),
    };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.COMMANDER)
  delete(@Param('id') id: string) {
    this.shiftsService.delete(+id);
    return {
      message: 'Shift deleted successfully',
    };
  }
}

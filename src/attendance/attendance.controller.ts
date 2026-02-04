import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto, UpdateAttendanceDto } from './dto/attendance.dto';

@ApiTags('attendance')
@Controller('attendance')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create attendance record' })
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all attendance records' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  findAll(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    if (startDate && endDate) {
      return this.attendanceService.getAttendanceByDateRange(startDate, endDate);
    }
    return this.attendanceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attendance record by ID' })
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update attendance record' })
  update(@Param('id') id: string, @Body() updateAttendanceDto: UpdateAttendanceDto) {
    return this.attendanceService.update(+id, updateAttendanceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete attendance record' })
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(+id);
  }

  @Post('check-in/:employeeId')
  @ApiOperation({ summary: 'Employee check-in' })
  checkIn(@Param('employeeId') employeeId: string) {
    return this.attendanceService.checkIn(+employeeId);
  }

  @Post('check-out/:employeeId')
  @ApiOperation({ summary: 'Employee check-out' })
  checkOut(@Param('employeeId') employeeId: string) {
    return this.attendanceService.checkOut(+employeeId);
  }
}
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto, UpdateAttendanceDto } from './dto/attendance.dto';
import { EmployeeService } from '../employee/employee.service';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    private employeeService: EmployeeService,
    @InjectQueue('email') private emailQueue: Queue,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    const employee = await this.employeeService.findOne(createAttendanceDto.employeeId);
    
    const attendance = this.attendanceRepository.create({
      ...createAttendanceDto,
      checkIn: new Date(createAttendanceDto.checkIn),
      checkOut: createAttendanceDto.checkOut ? new Date(createAttendanceDto.checkOut) : null,
    });

    const savedAttendance = await this.attendanceRepository.save(attendance);

    // Queue email notification
    await this.emailQueue.add('attendance-notification', {
      employeeEmail: employee.email,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      checkIn: savedAttendance.checkIn,
      checkOut: savedAttendance.checkOut,
    });

    return savedAttendance;
  }

  async findAll(): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      relations: ['employee'],
    });
  }

  async findOne(id: number): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
      relations: ['employee'],
    });

    if (!attendance) {
      throw new NotFoundException('Attendance record not found');
    }

    return attendance;
  }

  async update(id: number, updateAttendanceDto: UpdateAttendanceDto): Promise<Attendance> {
    const attendance = await this.findOne(id);

    if (updateAttendanceDto.checkOut) {
      attendance.checkOut = new Date(updateAttendanceDto.checkOut);
    }

    return this.attendanceRepository.save(attendance);
  }

  async remove(id: number): Promise<void> {
    const attendance = await this.findOne(id);
    await this.attendanceRepository.remove(attendance);
  }

  async getAttendanceByDateRange(startDate: string, endDate: string): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: {
        checkIn: Between(new Date(startDate), new Date(endDate)),
      },
      relations: ['employee'],
    });
  }

  async checkIn(employeeId: number): Promise<Attendance> {
    const employee = await this.employeeService.findOne(employeeId);
    
    // Check if employee already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingAttendance = await this.attendanceRepository.findOne({
      where: {
        employeeId,
        checkIn: Between(today, tomorrow),
      },
    });

    if (existingAttendance) {
      throw new BadRequestException('Employee already checked in today');
    }

    return this.create({
      employeeId,
      checkIn: new Date().toISOString(),
    });
  }

  async checkOut(employeeId: number): Promise<Attendance> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await this.attendanceRepository.findOne({
      where: {
        employeeId,
        checkIn: Between(today, tomorrow),
        checkOut: null,
      },
    });

    if (!attendance) {
      throw new NotFoundException('No check-in record found for today');
    }

    return this.update(attendance.id, {
      checkOut: new Date().toISOString(),
    });
  }
}
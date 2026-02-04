import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const existingEmployee = await this.employeeRepository.findOne({
      where: [
        { email: createEmployeeDto.email },
        { employeeIdentifier: createEmployeeDto.employeeIdentifier },
      ],
    });

    if (existingEmployee) {
      throw new BadRequestException('Employee with this email or identifier already exists');
    }

    const employee = this.employeeRepository.create(createEmployeeDto);
    return this.employeeRepository.save(employee);
  }

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find();
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['attendances'],
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);

    if (updateEmployeeDto.email || updateEmployeeDto.employeeIdentifier) {
      const existingEmployee = await this.employeeRepository.findOne({
        where: [
          { email: updateEmployeeDto.email },
          { employeeIdentifier: updateEmployeeDto.employeeIdentifier },
        ],
      });

      if (existingEmployee && existingEmployee.id !== id) {
        throw new BadRequestException('Employee with this email or identifier already exists');
      }
    }

    Object.assign(employee, updateEmployeeDto);
    return this.employeeRepository.save(employee);
  }

  async remove(id: number): Promise<void> {
    const employee = await this.findOne(id);
    await this.employeeRepository.remove(employee);
  }
}
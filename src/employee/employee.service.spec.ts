import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let repository: Repository<Employee>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        {
          provide: getRepositoryToken(Employee),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
    repository = module.get<Repository<Employee>>(getRepositoryToken(Employee));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new employee', async () => {
      const createEmployeeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        employeeIdentifier: 'EMP001',
        phoneNumber: '1234567890',
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(createEmployeeDto);
      mockRepository.save.mockResolvedValue({ ...createEmployeeDto, id: 1 });

      const result = await service.create(createEmployeeDto);

      expect(result).toEqual({ ...createEmployeeDto, id: 1 });
      expect(mockRepository.create).toHaveBeenCalledWith(createEmployeeDto);
    });

    it('should throw error if employee already exists', async () => {
      const createEmployeeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        employeeIdentifier: 'EMP001',
        phoneNumber: '1234567890',
      };

      mockRepository.findOne.mockResolvedValue({ id: 1, ...createEmployeeDto });

      await expect(service.create(createEmployeeDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return an employee', async () => {
      const employee = { id: 1, firstName: 'John', lastName: 'Doe' };
      mockRepository.findOne.mockResolvedValue(employee);

      const result = await service.findOne(1);

      expect(result).toEqual(employee);
    });

    it('should throw NotFoundException if employee not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an employee', async () => {
      const updateDto = { firstName: 'Jane' };
      const existingEmployee = { id: 1, firstName: 'John', lastName: 'Doe' };
      const updatedEmployee = { ...existingEmployee, ...updateDto };

      mockRepository.findOne.mockResolvedValue(existingEmployee);
      mockRepository.save.mockResolvedValue(updatedEmployee);

      const result = await service.update(1, updateDto);
      expect(result).toEqual(updatedEmployee);
    });
  });

  describe('remove', () => {
    it('should remove an employee', async () => {
      const employee = { id: 1, firstName: 'John' };
      mockRepository.findOne.mockResolvedValue(employee);
      mockRepository.remove.mockResolvedValue(employee);

      await service.remove(1);
      expect(mockRepository.remove).toHaveBeenCalledWith(employee);
    });
  });
});
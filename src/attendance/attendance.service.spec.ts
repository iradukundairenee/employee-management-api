import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getQueueToken } from '@nestjs/bull';
import { Repository } from 'typeorm';
import { AttendanceService } from './attendance.service';
import { Attendance } from './entities/attendance.entity';
import { EmployeeService } from '../employee/employee.service';

describe('AttendanceService', () => {
  let service: AttendanceService;
  let repository: Repository<Attendance>;
  let employeeService: EmployeeService;
  let emailQueue: any;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockEmployeeService = {
    findOne: jest.fn(),
  };

  const mockEmailQueue = {
    add: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        {
          provide: getRepositoryToken(Attendance),
          useValue: mockRepository,
        },
        {
          provide: EmployeeService,
          useValue: mockEmployeeService,
        },
        {
          provide: getQueueToken('email'),
          useValue: mockEmailQueue,
        },
      ],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
    repository = module.get<Repository<Attendance>>(getRepositoryToken(Attendance));
    employeeService = module.get<EmployeeService>(EmployeeService);
    emailQueue = module.get(getQueueToken('email'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create attendance record', async () => {
      const employee = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' };
      const createAttendanceDto = {
        employeeId: 1,
        checkIn: new Date().toISOString(),
      };

      mockEmployeeService.findOne.mockResolvedValue(employee);
      mockRepository.create.mockReturnValue(createAttendanceDto);
      mockRepository.save.mockResolvedValue({ ...createAttendanceDto, id: 1 });
      mockEmailQueue.add.mockResolvedValue({});

      const result = await service.create(createAttendanceDto);

      expect(result).toEqual({ ...createAttendanceDto, id: 1 });
      expect(mockEmailQueue.add).toHaveBeenCalledWith('attendance-notification', expect.any(Object));
    });
  });

  describe('checkIn', () => {
    it('should create check-in record', async () => {
      const employee = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' };
      
      mockEmployeeService.findOne.mockResolvedValue(employee);
      mockRepository.findOne.mockResolvedValue(null); // No existing attendance
      mockRepository.create.mockReturnValue({ employeeId: 1, checkIn: new Date() });
      mockRepository.save.mockResolvedValue({ id: 1, employeeId: 1, checkIn: new Date() });
      mockEmailQueue.add.mockResolvedValue({});

      const result = await service.checkIn(1);

      expect(result).toBeDefined();
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });
});
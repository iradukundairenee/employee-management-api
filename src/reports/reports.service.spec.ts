import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { AttendanceService } from '../attendance/attendance.service';

describe('ReportsService', () => {
  let service: ReportsService;

  const mockAttendanceService = {
    getAttendanceByDateRange: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: AttendanceService,
          useValue: mockAttendanceService,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate PDF report', async () => {
    const mockData = [{
      id: 1,
      checkIn: new Date('2024-01-01T09:00:00'),
      checkOut: new Date('2024-01-01T17:00:00'),
      employee: { firstName: 'John', lastName: 'Doe', employeeIdentifier: 'EMP001', email: 'john@test.com' },
    }];
    
    mockAttendanceService.getAttendanceByDateRange.mockResolvedValue(mockData);
    
    const result = await service.generatePdfReport('2024-01-01', '2024-01-31');
    expect(result).toBeInstanceOf(Buffer);
  });

  it('should generate Excel report', async () => {
    const mockData = [{
      id: 1,
      checkIn: new Date('2024-01-01T09:00:00'),
      checkOut: new Date('2024-01-01T17:00:00'),
      employee: { firstName: 'John', lastName: 'Doe', employeeIdentifier: 'EMP001', email: 'john@test.com' },
    }];
    
    mockAttendanceService.getAttendanceByDateRange.mockResolvedValue(mockData);
    
    const result = await service.generateExcelReport('2024-01-01', '2024-01-31');
    expect(result).toBeInstanceOf(Buffer);
  });
});
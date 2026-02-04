import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

describe('AttendanceController', () => {
  let controller: AttendanceController;

  const mockAttendanceService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    checkIn: jest.fn(),
    checkOut: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceController],
      providers: [
        {
          provide: AttendanceService,
          useValue: mockAttendanceService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AttendanceController>(AttendanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should check in employee', async () => {
    const result = { message: 'Check-in successful' };
    mockAttendanceService.checkIn.mockResolvedValue(result);
    
    expect(await controller.checkIn('1')).toEqual(result);
  });

  it('should check out employee', async () => {
    const result = { message: 'Check-out successful' };
    mockAttendanceService.checkOut.mockResolvedValue(result);
    
    expect(await controller.checkOut('1')).toEqual(result);
  });
});
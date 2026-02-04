import { Test, TestingModule } from '@nestjs/testing';
import { MailProcessor } from './mail.processor';
import { MailService } from './mail.service';

describe('MailProcessor', () => {
  let processor: MailProcessor;

  const mockMailService = {
    sendAttendanceNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailProcessor,
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    processor = module.get<MailProcessor>(MailProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  it('should handle attendance notification', async () => {
    const job = {
      data: {
        employeeEmail: 'test@test.com',
        employeeName: 'John Doe',
        checkIn: new Date(),
        checkOut: null,
      },
    };

    await processor.handleAttendanceNotification(job as any);

    expect(mockMailService.sendAttendanceNotification).toHaveBeenCalledWith(
      'test@test.com',
      'John Doe',
      job.data.checkIn,
      null
    );
  });
});
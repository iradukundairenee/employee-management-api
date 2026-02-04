import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';

describe('MailService', () => {
  let service: MailService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        MAIL_HOST: 'smtp.gmail.com',
        MAIL_PORT: 587,
        MAIL_USER: 'test@gmail.com',
        MAIL_PASS: 'password',
        MAIL_FROM: 'test@gmail.com',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send password reset email', async () => {
    const sendMailSpy = jest.spyOn(service['transporter'], 'sendMail').mockResolvedValue({});
    
    await service.sendPasswordResetEmail('test@test.com', 'token123');
    
    expect(sendMailSpy).toHaveBeenCalled();
  });

  it('should send attendance notification', async () => {
    const sendMailSpy = jest.spyOn(service['transporter'], 'sendMail').mockResolvedValue({});
    
    await service.sendAttendanceNotification('test@test.com', 'John Doe', new Date());
    
    expect(sendMailSpy).toHaveBeenCalled();
  });
});
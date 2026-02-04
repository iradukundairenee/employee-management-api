import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register user', async () => {
    const registerDto = { email: 'test@test.com', password: 'password' };
    const result = { id: 1, email: 'test@test.com' };
    
    mockAuthService.register.mockResolvedValue(result);
    
    expect(await controller.register(registerDto)).toEqual(result);
  });

  it('should login user', async () => {
    const loginDto = { email: 'test@test.com', password: 'password' };
    const result = { access_token: 'token' };
    
    mockAuthService.login.mockResolvedValue(result);
    
    expect(await controller.login(loginDto)).toEqual(result);
  });

  it('should handle forgot password', async () => {
    const forgotDto = { email: 'test@test.com' };
    const result = { message: 'Reset email sent' };
    
    mockAuthService.forgotPassword.mockResolvedValue(result);
    
    expect(await controller.forgotPassword(forgotDto)).toEqual(result);
  });

  it('should reset password', async () => {
    const resetDto = { token: 'token', newPassword: 'newpassword' };
    const result = { message: 'Password reset successful' };
    
    mockAuthService.resetPassword.mockResolvedValue(result);
    
    expect(await controller.resetPassword(resetDto)).toEqual(result);
  });
});
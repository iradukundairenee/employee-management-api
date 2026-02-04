import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

describe('EmployeeController', () => {
  let controller: EmployeeController;

  const mockEmployeeService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [
        {
          provide: EmployeeService,
          useValue: mockEmployeeService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<EmployeeController>(EmployeeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create employee', async () => {
    const createDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      employeeIdentifier: 'EMP001',
      phoneNumber: '1234567890',
    };
    
    mockEmployeeService.create.mockResolvedValue({ id: 1, ...createDto });
    
    const result = await controller.create(createDto);
    expect(result).toEqual({ id: 1, ...createDto });
  });

  it('should find all employees', async () => {
    const employees = [{ id: 1, firstName: 'John' }];
    mockEmployeeService.findAll.mockResolvedValue(employees);
    
    const result = await controller.findAll();
    expect(result).toEqual(employees);
  });

  it('should find one employee', async () => {
    const employee = { id: 1, firstName: 'John' };
    mockEmployeeService.findOne.mockResolvedValue(employee);
    
    const result = await controller.findOne('1');
    expect(result).toEqual(employee);
  });

  it('should update employee', async () => {
    const updateDto = { firstName: 'Jane' };
    const updatedEmployee = { id: 1, firstName: 'Jane' };
    mockEmployeeService.update.mockResolvedValue(updatedEmployee);
    
    const result = await controller.update('1', updateDto);
    expect(result).toEqual(updatedEmployee);
  });

  it('should remove employee', async () => {
    mockEmployeeService.remove.mockResolvedValue(undefined);
    
    await controller.remove('1');
    expect(mockEmployeeService.remove).toHaveBeenCalledWith(1);
  });
});
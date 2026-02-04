import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Response } from 'express';

describe('ReportsController', () => {
  let controller: ReportsController;

  const mockReportsService = {
    generatePdfReport: jest.fn(),
    generateExcelReport: jest.fn(),
  };

  const mockResponse = {
    set: jest.fn(),
    end: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: mockReportsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ReportsController>(ReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should generate PDF report', async () => {
    const pdfBuffer = Buffer.from('pdf content');
    mockReportsService.generatePdfReport.mockResolvedValue(pdfBuffer);

    await controller.generatePdfReport('2024-01-01', '2024-01-31', mockResponse);

    expect(mockReportsService.generatePdfReport).toHaveBeenCalledWith('2024-01-01', '2024-01-31');
    expect(mockResponse.set).toHaveBeenCalled();
    expect(mockResponse.end).toHaveBeenCalledWith(pdfBuffer);
  });

  it('should generate Excel report', async () => {
    const excelBuffer = Buffer.from('excel content');
    mockReportsService.generateExcelReport.mockResolvedValue(excelBuffer);

    await controller.generateExcelReport('2024-01-01', '2024-01-31', mockResponse);

    expect(mockReportsService.generateExcelReport).toHaveBeenCalledWith('2024-01-01', '2024-01-31');
    expect(mockResponse.set).toHaveBeenCalled();
    expect(mockResponse.end).toHaveBeenCalledWith(excelBuffer);
  });
});
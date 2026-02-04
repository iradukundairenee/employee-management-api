import { Injectable } from '@nestjs/common';
import { AttendanceService } from '../attendance/attendance.service';
import * as ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';

@Injectable()
export class ReportsService {
  constructor(private attendanceService: AttendanceService) {}

  async generatePdfReport(startDate: string, endDate: string): Promise<Buffer> {
    const attendances = await this.attendanceService.getAttendanceByDateRange(startDate, endDate);
    
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Attendance Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Period: ${startDate} to ${endDate}`, 20, 35);

    let yPosition = 50;
    doc.text('Employee', 20, yPosition);
    doc.text('Check In', 80, yPosition);
    doc.text('Check Out', 140, yPosition);

    attendances.forEach((attendance, index) => {
      yPosition += 10;
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }

      const employeeName = `${attendance.employee.firstName} ${attendance.employee.lastName}`;
      const checkIn = attendance.checkIn.toLocaleString();
      const checkOut = attendance.checkOut ? attendance.checkOut.toLocaleString() : 'Not checked out';

      doc.text(employeeName, 20, yPosition);
      doc.text(checkIn, 80, yPosition);
      doc.text(checkOut, 140, yPosition);
    });

    return Buffer.from(doc.output('arraybuffer'));
  }

  async generateExcelReport(startDate: string, endDate: string): Promise<Buffer> {
    const attendances = await this.attendanceService.getAttendanceByDateRange(startDate, endDate);
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attendance Report');

    worksheet.columns = [
      { header: 'Employee ID', key: 'employeeId', width: 15 },
      { header: 'Employee Name', key: 'employeeName', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Check In', key: 'checkIn', width: 20 },
      { header: 'Check Out', key: 'checkOut', width: 20 },
      { header: 'Date', key: 'date', width: 15 },
    ];

    attendances.forEach(attendance => {
      worksheet.addRow({
        employeeId: attendance.employee.employeeIdentifier,
        employeeName: `${attendance.employee.firstName} ${attendance.employee.lastName}`,
        email: attendance.employee.email,
        checkIn: attendance.checkIn.toLocaleString(),
        checkOut: attendance.checkOut ? attendance.checkOut.toLocaleString() : 'Not checked out',
        date: attendance.checkIn.toDateString(),
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
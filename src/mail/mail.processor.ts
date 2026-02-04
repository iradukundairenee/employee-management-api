import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from './mail.service';

@Processor('email')
export class MailProcessor {
  constructor(private mailService: MailService) {}

  @Process('attendance-notification')
  async handleAttendanceNotification(job: Job) {
    const { employeeEmail, employeeName, checkIn, checkOut } = job.data;
    await this.mailService.sendAttendanceNotification(employeeEmail, employeeName, checkIn, checkOut);
  }
}
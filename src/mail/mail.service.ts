import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    const resetUrl = `http://localhost:3000/auth/reset-password?token=${resetToken}`;
    
    await this.transporter.sendMail({
      from: this.configService.get<string>('MAIL_FROM'),
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
  }

  async sendAttendanceNotification(email: string, employeeName: string, checkIn: Date, checkOut?: Date) {
    const subject = checkOut ? 'Check-out Recorded' : 'Check-in Recorded';
    const action = checkOut ? 'checked out' : 'checked in';
    const time = checkOut ? checkOut.toLocaleString() : checkIn.toLocaleString();

    await this.transporter.sendMail({
      from: this.configService.get<string>('MAIL_FROM'),
      to: email,
      subject,
      html: `
        <h2>Attendance Notification</h2>
        <p>Hello ${employeeName},</p>
        <p>You have successfully ${action} at ${time}.</p>
        <p>Thank you!</p>
      `,
    });
  }
}
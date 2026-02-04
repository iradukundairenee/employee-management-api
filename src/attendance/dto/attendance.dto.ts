import { IsNumber, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttendanceDto {
  @ApiProperty()
  @IsNumber()
  employeeId: number;

  @ApiProperty()
  @IsDateString()
  checkIn: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  checkOut?: string;
}

export class UpdateAttendanceDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  checkOut?: string;
}
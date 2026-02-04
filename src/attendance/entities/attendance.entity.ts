import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from '../../employee/entities/employee.entity';

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeId: number;

  @ManyToOne(() => Employee, employee => employee.attendances)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column({ type: 'datetime' })
  checkIn: Date;

  @Column({ type: 'datetime', nullable: true })
  checkOut: Date;

  @CreateDateColumn()
  createdAt: Date;
}
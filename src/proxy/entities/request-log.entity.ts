import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('request_logs')
export class RequestLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  proxy_instance: string;

  @Column()
  status: number;

  @Column({ nullable: true })
  error_message: string;

  @CreateDateColumn()
  created_at: Date;
}

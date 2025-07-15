import { BaseEntity } from 'src/database/base.entity';
import { Entity, Column } from 'typeorm';

export enum RequestPaymentStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DENIED = 'denied',
}

@Entity({ name: 'request_payment' })
export class RequestPaymentEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  payer: string;

  @Column({ type: 'varchar' })
  payee: string;

  @Column({ type: 'varchar' })
  amount: string;

  @Column({ type: 'varchar', nullable: true })
  token: string;

  @Column({ type: 'varchar' })
  message: string;

  @Column({
    type: 'enum',
    enum: RequestPaymentStatus,
    default: RequestPaymentStatus.PENDING,
  })
  status: RequestPaymentStatus;
}

import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { NoteType } from 'src/common/enums/note';

export enum TransactionStatus {
  PENDING = 'pending',
  RECALLED = 'recalled',
  CONSUMED = 'consumed',
}

@Entity({ name: 'transactions' })
export class TransactionEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  public sender: string;

  @Column({ type: 'varchar' })
  public recipient: string;

  @Column({ type: 'jsonb' })
  public assets: { faucetId: string; amount: string }[];

  @Column({ type: 'boolean', default: false })
  public private: boolean;

  @Column({ type: 'boolean', default: false })
  public recallable: boolean;

  @Column({ type: 'timestamp', nullable: true })
  public recallableTime: Date | null;

  @Column({ type: 'jsonb' })
  public serialNumber: number[];

  @Column({ type: 'enum', enum: NoteType, nullable: true })
  public noteType: NoteType | null;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  public status: TransactionStatus;
}

import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { NoteStatus, NoteType } from 'src/common/enums/note';

@Entity({ name: 'transactions' })
export class TransactionEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  public sender: string;

  @Column({ type: 'varchar' })
  public recipient: string;

  @Column({ type: 'jsonb' })
  public assets: { faucetId: string; amount: string }[];

  @Column({ type: 'boolean', default: true })
  public private: boolean;

  @Column({ type: 'boolean', default: true })
  public recallable: boolean;

  @Column({ type: 'timestamp', nullable: true })
  public recallableTime: Date | null;

  @Column({ type: 'jsonb' })
  public serialNumber: number[];

  @Column({ type: 'enum', enum: NoteType, nullable: true })
  public noteType: NoteType | null;

  @Column({
    type: 'enum',
    enum: NoteStatus,
    default: NoteStatus.PENDING,
  })
  public status: NoteStatus;
}

import { BaseEntity } from 'src/database/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'address_book' })
export class AddressBookEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  userAddress: string;

  @Column({ type: 'varchar' })
  category: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  token?: string;
}

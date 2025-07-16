import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressBookEntity } from './address-book.entity';
import { AddressBookRepository } from './address-book.repository';
import { AddressBookService } from './address-book.service';
import { AddressBookController } from './address-book.controller';
import { WalletAuthModule } from '../wallet-auth/wallet-auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([AddressBookEntity]), WalletAuthModule],
  providers: [AddressBookRepository, AddressBookService],
  controllers: [AddressBookController],
  exports: [AddressBookService, AddressBookRepository],
})
export class AddressBookModule {}

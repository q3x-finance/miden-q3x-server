import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  GroupPaymentEntity,
  GroupPaymentGroupEntity,
  GroupPaymentMemberStatusEntity,
} from './group-payment.entity';
import { GroupPaymentRepository } from './group-payment.repository';
import { GroupPaymentService } from './group-payment.service';
import { GroupPaymentController } from './group-payment.controller';
import { RequestPaymentModule } from '../request-payment/request-payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GroupPaymentGroupEntity,
      GroupPaymentEntity,
      GroupPaymentMemberStatusEntity,
    ]),
    forwardRef(() => RequestPaymentModule),
  ],
  providers: [GroupPaymentRepository, GroupPaymentService],
  controllers: [GroupPaymentController],
  exports: [GroupPaymentService, GroupPaymentRepository],
})
export class GroupPaymentModule {}

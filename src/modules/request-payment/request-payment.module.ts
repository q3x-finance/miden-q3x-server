import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestPaymentEntity } from './request-payment.entity';
import { RequestPaymentRepository } from './request-payment.repository';
import { RequestPaymentService } from './request-payment.service';
import { RequestPaymentController } from './request-payment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RequestPaymentEntity])],
  providers: [RequestPaymentRepository, RequestPaymentService],
  controllers: [RequestPaymentController],
  exports: [RequestPaymentService, RequestPaymentRepository],
})
export class RequestPaymentModule {}

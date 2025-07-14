import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { In } from 'typeorm';
import { RequestPaymentRepository } from './request-payment.repository';
import { CreateRequestPaymentDto } from './request-payment.dto';
import { RequestPaymentStatus } from './request-payment.entity';
import { handleError } from 'src/common/utils/errors';
import { ErrorRequestPayment } from 'src/common/enums/errors';

@Injectable()
export class RequestPaymentService {
  private readonly logger = new Logger(RequestPaymentService.name);
  constructor(
    private readonly requestPaymentRepository: RequestPaymentRepository,
  ) {}

  // *************************************************
  // **************** GET METHODS ******************
  // *************************************************

  async getRequests(userAddress: string) {
    try {
      const result = await this.requestPaymentRepository.find({
        payerAddress: userAddress,
        status: In([
          RequestPaymentStatus.PENDING,
          RequestPaymentStatus.ACCEPTED,
        ]),
      });

      // put into pending and accepted
      const pending = result.filter(
        (item) => item.status === RequestPaymentStatus.PENDING,
      );
      const accepted = result.filter(
        (item) => item.status === RequestPaymentStatus.ACCEPTED,
      );
      return { pending, accepted };
    } catch (error) {
      handleError(error, this.logger);
    }
  }

  // *************************************************
  // **************** POST METHODS ******************
  // *************************************************

  async createRequest(dto: CreateRequestPaymentDto) {
    try {
      return this.requestPaymentRepository.create(dto);
    } catch (error) {
      handleError(error, this.logger);
    }
  }

  // *************************************************
  // **************** PUT METHODS ******************
  // *************************************************

  async acceptRequest(id: number, userAddress: string) {
    try {
      const req = await this.requestPaymentRepository.findOne({
        id,
        payerAddress: userAddress,
      });
      if (!req) throw new BadRequestException(ErrorRequestPayment.NOT_FOUND);
      if (req.status !== RequestPaymentStatus.PENDING)
        throw new BadRequestException(ErrorRequestPayment.NOT_PENDING);
      return this.requestPaymentRepository.updateStatus(
        id,
        RequestPaymentStatus.ACCEPTED,
      );
    } catch (error) {
      handleError(error, this.logger);
    }
  }

  async denyRequest(id: number, userAddress: string) {
    try {
      const req = await this.requestPaymentRepository.findOne({
        id,
        payerAddress: userAddress,
      });
      if (!req) throw new BadRequestException(ErrorRequestPayment.NOT_FOUND);
      if (req.status !== RequestPaymentStatus.PENDING)
        throw new BadRequestException(ErrorRequestPayment.NOT_PENDING);
      return this.requestPaymentRepository.updateStatus(
        id,
        RequestPaymentStatus.DENIED,
      );
    } catch (error) {
      handleError(error, this.logger);
    }
  }
}

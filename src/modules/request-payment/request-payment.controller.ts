import { Body, Controller, Get, Post, Put, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
import { RequestPaymentService } from './request-payment.service';
import { CreateRequestPaymentDto } from './request-payment.dto';

@ApiTags('Request Payment')
@ApiHeader({
  name: 'x-api-key',
  description: 'API Key for authentication',
  required: true,
})
@Controller('request-payment')
export class RequestPaymentController {
  constructor(private readonly service: RequestPaymentService) {}

  // *************************************************
  // **************** GET METHODS ******************
  // *************************************************

  @Get()
  @ApiOperation({ summary: 'Get all pending and accepted requests for user' })
  @ApiResponse({ status: 200, description: 'List of requests' })
  async getAllPendingRequest(@Query('userAddress') userAddress: string) {
    return this.service.getRequests(userAddress);
  }

  // *************************************************
  // **************** POST METHODS ******************
  // *************************************************

  @Post()
  @ApiOperation({ summary: 'Create a new payment request' })
  @ApiResponse({ status: 201, description: 'Request created' })
  @ApiBody({ type: CreateRequestPaymentDto })
  async create(@Body() dto: CreateRequestPaymentDto) {
    return this.service.createRequest(dto);
  }

  // *************************************************
  // **************** PUT METHODS ******************
  // *************************************************

  @Put(':id/accept')
  @ApiOperation({ summary: 'Accept a pending request' })
  @ApiResponse({ status: 200, description: 'Request accepted' })
  async accept(
    @Param('id') id: number,
    @Query('userAddress') userAddress: string,
  ) {
    return this.service.acceptRequest(id, userAddress);
  }

  @Put(':id/deny')
  @ApiOperation({ summary: 'Deny a pending request' })
  @ApiResponse({ status: 200, description: 'Request denied' })
  async deny(
    @Param('id') id: number,
    @Query('userAddress') userAddress: string,
  ) {
    return this.service.denyRequest(id, userAddress);
  }
}

import { Body, Controller, Get, Post, Query, Put } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { SendTransactionDto, RecallRequestDto } from './transaction.dto';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Transactions')
@ApiHeader({
  name: 'x-api-key',
  description: 'API Key for authentication',
  required: true,
})
@Controller('/transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // *************************************************
  // **************** GET METHODS ********************
  // *************************************************
  @Get('/recall-dashboard')
  @ApiOperation({
    summary: 'Get recallable transactions',
    description: 'Get recallable transactions',
  })
  @ApiResponse({
    status: 200,
    description: 'Recallable transactions fetched successfully',
  })
  async getRecallable(@Query('userAddress') userAddress: string) {
    return this.transactionService.getRecallDashboardData(userAddress);
  }

  @Get('/consumable')
  @ApiQuery({
    name: 'userAddress',
    type: String,
    description: 'The address of the user',
  })
  @ApiOperation({
    summary: 'Get consumable transactions',
    description: 'Get consumable transactions',
  })
  @ApiResponse({
    status: 200,
    description: 'Consumable transactions fetched successfully',
  })
  async getConsumable(@Query('userAddress') userAddress: string) {
    return this.transactionService.getConsumableTransactions(userAddress);
  }

  // *************************************************
  // **************** POST METHODS *******************
  // *************************************************
  @Post('/send-single')
  @ApiOperation({
    summary: 'Send notes in single transaction',
    description: 'Send notes in single transaction',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction sent successfully',
  })
  @ApiBody({ type: SendTransactionDto })
  async sendSingle(@Body() body: SendTransactionDto) {
    return this.transactionService.sendSingle(body);
  }

  @Post('/send-batch')
  @ApiOperation({
    summary: 'Send notes in batch',
    description: 'Send notes in batch',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction sent successfully',
  })
  @ApiBody({ type: SendTransactionDto, isArray: true })
  async sendBatch(@Body() body: SendTransactionDto[]) {
    return this.transactionService.sendBatch(body);
  }

  // *************************************************
  // **************** PUT METHODS *******************
  // *************************************************
  @Put('/recall')
  @ApiOperation({ summary: 'Recall multiple transactions and gifts' })
  @ApiResponse({ status: 200, description: 'Batch recall result' })
  @ApiBody({ type: RecallRequestDto })
  async recallBatch(@Body() dto: RecallRequestDto) {
    return this.transactionService.recallBatch(dto);
  }

  @Put('/consume')
  @ApiOperation({
    summary: 'Consume transactions',
    description: 'Consume transactions',
  })
  @ApiResponse({
    status: 200,
    description: 'Transactions consumed successfully',
  })
  @ApiBody({
    type: String,
    isArray: true,
    examples: {
      example1: { value: ['1', '2'] },
    },
  })
  async consumeTransactions(@Body() transactionIds: string[]) {
    return this.transactionService.consumeTransactions(transactionIds);
  }
}

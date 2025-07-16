import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { SendTransactionDto, RecallRequestDto } from './transaction.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { WalletAuthGuard } from '../wallet-auth/wallet-auth.guard';
import { RequestWithWalletAuth } from 'src/common/interfaces';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('/transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // *************************************************
  // **************** GET METHODS ********************
  // *************************************************
  @Get('/recall-dashboard')
  @UseGuards(WalletAuthGuard)
  @ApiOperation({
    summary: 'Get recallable transactions',
    description: 'Get recallable transactions',
  })
  @ApiResponse({
    status: 200,
    description: 'Recallable transactions fetched successfully',
  })
  async getRecallable(@Req() req: RequestWithWalletAuth) {
    return this.transactionService.getRecallDashboardData(
      req.walletAuth.walletAddress,
    );
  }

  @Get('/consumable')
  @UseGuards(WalletAuthGuard)
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
  async getConsumable(@Req() req: RequestWithWalletAuth) {
    return this.transactionService.getConsumableTransactions(
      req.walletAuth.walletAddress,
    );
  }

  // *************************************************
  // **************** POST METHODS *******************
  // *************************************************
  @Post('/send-single')
  @UseGuards(WalletAuthGuard)
  @ApiOperation({
    summary: 'Send notes in single transaction',
    description: 'Send notes in single transaction',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction sent successfully',
  })
  @ApiBody({ type: SendTransactionDto })
  async sendSingle(
    @Body() body: SendTransactionDto,
    @Req() req: RequestWithWalletAuth,
  ) {
    return this.transactionService.sendSingle(
      body,
      req.walletAuth.walletAddress,
    );
  }

  @Post('/send-batch')
  @UseGuards(WalletAuthGuard)
  @ApiOperation({
    summary: 'Send notes in batch',
    description: 'Send notes in batch',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction sent successfully',
  })
  @ApiBody({ type: SendTransactionDto, isArray: true })
  async sendBatch(
    @Body() body: SendTransactionDto[],
    @Req() req: RequestWithWalletAuth,
  ) {
    return this.transactionService.sendBatch(
      body,
      req.walletAuth.walletAddress,
    );
  }

  // *************************************************
  // **************** PUT METHODS *******************
  // *************************************************
  @Put('/recall')
  @UseGuards(WalletAuthGuard)
  @ApiOperation({ summary: 'Recall multiple transactions and gifts' })
  @ApiResponse({ status: 200, description: 'Batch recall result' })
  @ApiBody({ type: RecallRequestDto })
  async recallBatch(
    @Body() dto: RecallRequestDto,
    @Req() req: RequestWithWalletAuth,
  ) {
    return this.transactionService.recallBatch(
      dto,
      req.walletAuth.walletAddress,
    );
  }

  @Put('/consume')
  @UseGuards(WalletAuthGuard)
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
  async consumeTransactions(
    @Body() transactionIds: string[],
    @Req() req: RequestWithWalletAuth,
  ) {
    return this.transactionService.consumeTransactions(
      transactionIds,
      req.walletAuth.walletAddress,
    );
  }
}

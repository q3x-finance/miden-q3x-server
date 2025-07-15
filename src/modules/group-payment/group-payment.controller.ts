import { Body, Controller, Post, Get, Query, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiHeader,
} from '@nestjs/swagger';
import { GroupPaymentService } from './group-payment.service';
import { CreateGroupDto, CreateGroupPaymentDto } from './group-payment.dto';

@ApiTags('Group Payment')
@ApiHeader({
  name: 'x-api-key',
  description: 'API Key for authentication',
  required: true,
})
@Controller('group-payment')
export class GroupPaymentController {
  constructor(private readonly service: GroupPaymentService) {}

  @Post('group')
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({ status: 201, description: 'Group created' })
  @ApiBody({ type: CreateGroupDto })
  async createGroup(@Body() dto: CreateGroupDto) {
    return this.service.createGroup(dto);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a group payment (with or without group)' })
  @ApiResponse({ status: 201, description: 'Group payment created' })
  @ApiBody({ type: CreateGroupPaymentDto })
  async createGroupPayment(@Body() dto: CreateGroupPaymentDto) {
    return this.service.createGroupPayment(dto);
  }

  @Get('groups')
  @ApiOperation({ summary: 'Get all groups by owner address' })
  @ApiResponse({ status: 200, description: 'Groups retrieved successfully' })
  @ApiQuery({
    name: 'ownerAddress',
    description: 'Owner address to filter groups',
  })
  async getAllGroups(@Query('ownerAddress') ownerAddress: string) {
    return this.service.getAllGroups(ownerAddress);
  }

  @Get('group/:groupId/payments')
  @ApiOperation({ summary: 'Get all payments in a group, categorized by date' })
  @ApiResponse({
    status: 200,
    description: 'Group payments retrieved successfully',
  })
  @ApiParam({ name: 'groupId', description: 'Group ID to get payments for' })
  async getGroupPayments(@Param('groupId') groupId: number) {
    return this.service.getGroupPayments(groupId);
  }

  @Get('link/:linkCode')
  @ApiOperation({ summary: 'Get group payment details by link code' })
  @ApiResponse({
    status: 200,
    description: 'Payment details retrieved successfully',
  })
  @ApiParam({
    name: 'linkCode',
    description: 'Link code to get payment details for',
  })
  async getPaymentByLink(@Param('linkCode') linkCode: string) {
    return this.service.getPaymentByLink(linkCode);
  }
}

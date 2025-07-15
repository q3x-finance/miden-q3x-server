import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiHeader,
} from '@nestjs/swagger';
import { GiftService } from './gift.service';
import { CreateGiftDto } from './gift.dto';

@ApiTags('Gift')
@ApiHeader({
  name: 'x-api-key',
  description: 'API Key for authentication',
  required: true,
})
@Controller('gift')
export class GiftController {
  constructor(private readonly service: GiftService) {}

  // *************************************************
  // **************** GET METHODS *******************
  // *************************************************
  @Get('/:secret')
  @ApiOperation({ summary: 'Get gift details by secret' })
  @ApiResponse({ status: 200, description: 'Gift details' })
  async getGift(@Param('secret') secret: string) {
    return this.service.getGiftBySecret(secret);
  }

  // *************************************************
  // **************** POST METHODS *******************
  // *************************************************
  @Post('/send')
  @ApiOperation({
    summary: 'Send a gift (creates a gift and returns a link with secret)',
  })
  @ApiResponse({ status: 201, description: 'Gift created' })
  @ApiBody({ type: CreateGiftDto })
  async sendGift(@Body() dto: CreateGiftDto) {
    return this.service.sendGift(dto);
  }

  // *************************************************
  // **************** PUT METHODS *******************
  // *************************************************
  @Put('/:secret/open')
  @ApiOperation({ summary: 'Open a gift' })
  @ApiParam({ name: 'secret', description: 'Secret of the gift' })
  @ApiResponse({ status: 200, description: 'Gift opened' })
  async openGift(@Param('secret') secret: string) {
    return this.service.openGift(secret);
  }
}

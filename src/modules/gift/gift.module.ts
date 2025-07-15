import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiftEntity } from './gift.entity';
import { GiftRepository } from './gift.repository';
import { GiftService } from './gift.service';
import { GiftController } from './gift.controller';
import { AppConfigService } from 'src/common/config/services/config.service';

@Module({
  imports: [TypeOrmModule.forFeature([GiftEntity])],
  providers: [GiftRepository, GiftService, AppConfigService],
  controllers: [GiftController],
  exports: [GiftService, GiftRepository],
})
export class GiftModule {}

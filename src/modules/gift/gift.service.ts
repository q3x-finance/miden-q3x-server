import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes, createHash } from 'crypto';
import { GiftRepository } from './gift.repository';
import { CreateGiftDto } from './gift.dto';
import { AppConfigService } from 'src/common/config/services/config.service';
import { NoteStatus, NoteType } from 'src/common/enums/note';
import { ErrorGift } from 'src/common/enums/errors';

function hashSecret(secret: string): string {
  return createHash('sha256').update(secret).digest('hex');
}

@Injectable()
export class GiftService {
  constructor(
    private readonly giftRepository: GiftRepository,
    private readonly appConfigService: AppConfigService,
  ) {}

  // *************************************************
  // **************** GET METHODS ********************
  // *************************************************
  public async getGiftBySecret(secret: string) {
    const secretHash = hashSecret(secret);
    return this.giftRepository.findOne({
      secretHash,
    });
  }

  // *************************************************
  // **************** POST METHODS *******************
  // *************************************************

  public async sendGift(dto: CreateGiftDto) {
    const secret = randomBytes(24).toString('hex');
    // @note: we dont store secret in the database, we only store the hash
    const secretHash = hashSecret(secret);

    const gift = await this.giftRepository.create({
      sender: dto.senderAddress,
      assets: {
        faucetId: dto.token,
        amount: dto.amount,
      },
      secretHash,
      status: NoteStatus.PENDING,
      recallableTime: new Date(
        Date.now() +
          this.appConfigService.otherConfig.giftRecallableAfter * 1000,
      ),
      serialNumber: dto.serialNumber,
      noteType: NoteType.GIFT,
    });

    return { ...gift, link: `/gift/${secret}` };
  }

  // *************************************************
  // **************** PUT METHODS *******************
  // *************************************************

  public async openGift(secret: string) {
    const secretHash = hashSecret(secret);

    // find the gift by secret hash
    const gift = await this.giftRepository.findOne({ secretHash });
    if (!gift) throw new BadRequestException(ErrorGift.GiftNotFound);

    return this.giftRepository.updateOne(
      { secretHash },
      { status: NoteStatus.CONSUMED, openedAt: new Date() },
    );
  }

  // *************************************************
  // **************** UTILS METHODS ********************
  // *************************************************

  public async findRecallableGifts(senderAddress: string) {
    return this.giftRepository.find({
      sender: senderAddress,
      status: NoteStatus.PENDING,
      recallable: true,
    });
  }

  public async findRecalledGifts(senderAddress: string) {
    return this.giftRepository.find({
      sender: senderAddress,
      status: NoteStatus.RECALLED,
    });
  }

  public async recallGift(id: number) {
    return this.giftRepository.updateOne(
      { id },
      { status: NoteStatus.RECALLED, recalledAt: new Date() },
    );
  }
}

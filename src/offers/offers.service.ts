import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(offer: CreateOfferDto, user) {
    const wish = await this.wishesService.findOne(offer.itemId);

    if (!wish) throw new NotFoundException('Такого подарка не существует');
    if (wish.owner.id === user.id)
      throw new BadRequestException('Нельзя скидываться на свои подарки');

    const { raised, ...rest } = wish;
    const updatedWish = { ...rest, raised: wish.raised + offer.amount };

    await this.wishesService.update(wish.id, updatedWish, user.id);
    await this.offerRepository.save({ ...offer, user: user, item: wish });
  }

  findAll() {
    return `This action returns all offers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} offer`;
  }
}

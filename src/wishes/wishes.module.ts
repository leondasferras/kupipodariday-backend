import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { Wish } from './entities/wish.entity';

@Module({
  imports: [Wish],
  controllers: [WishesController],
  providers: [WishesService],
})
export class WishesModule {}

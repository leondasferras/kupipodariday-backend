import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    private userService: UsersService,
  ) {}

  async create(wish: CreateWishDto, userId: number) {
    const user = await this.userService.findOne(userId);
    return await this.wishRepository.save({
      ...wish,
      owner: user,
    });
  }

  async findLast() {
    return await this.wishRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 40,
      relations: ['owner'],
    });
  }

  async findTop() {
    return await this.wishRepository.find({
      order: {
        copied: 'ASC',
      },
      relations: ['owner'],
      take: 10,
    });
  }

  async findOne(id: number) {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });
    if (!wish) throw new NotFoundException('Такого подарка не существует');
    return wish;
  }

  async update(id: number, dtoWish: UpdateWishDto, userId) {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });
    if (!wish) throw new NotFoundException('Такого подарка не существует');
    if (wish.owner.id !== userId) {
      throw new BadRequestException('Нельзя редактировать чужие подарки');
    }
    if ((dtoWish.description || dtoWish.price) && wish.offers.length > 0) {
      throw new BadRequestException('Нельзя редактировать подарок');
    }
    return await this.wishRepository.update(id, dtoWish);
  }

  async createCopy(wishId: number, userId: number) {
    const wish = await this.wishRepository.findOneBy({ id: wishId });
    if (!wish) throw new NotFoundException('Такого подарка не существует');
    const newOwner = await this.userService.findOne(userId);

    await this.wishRepository.update(wishId, {
      copied: (wish.copied += 1),
    });

    const copiedWish = {
      ...wish,
      owner: newOwner,
      copied: 0,
      raised: 0,
      offers: [],
    };

    return await this.create(copiedWish, newOwner.id);
  }

  async remove(id: number, userId) {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!wish) throw new NotFoundException('Такого подарка не существует');
    if (wish.owner.id !== userId) {
      throw new BadRequestException('Нельзя удалять чужие подарки');
    }
    return this.wishRepository.delete({ id });
  }

  public async find(options: FindManyOptions<Wish>) {
    return this.wishRepository.find(options);
  }
}

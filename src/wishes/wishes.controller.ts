import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/auth/guards/jwtGuard';

@UseGuards(JwtGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  create(@Body() wish: CreateWishDto, @Req() req) {
    return this.wishesService.create(wish, req.user.id);
  }

  @Get('last')
  findLast() {
    return this.wishesService.findLast();
  }

  @Get('top')
  findById() {
    return this.wishesService.findTop();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req,
  ) {
    await this.wishesService.update(+id, updateWishDto, req.user.id);
    return updateWishDto;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    await this.wishesService.remove(+id, req.user.id);
    return id;
  }

  @Post(':id/copy')
  async createCopy(@Param('id') wishId: string, @Req() req) {
    return this.wishesService.createCopy(+wishId, req.user.id);
  }
}

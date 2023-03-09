import { Length } from 'class-validator';
import { IsDecimal, IsUrl } from 'class-validator/types/decorator/decorators';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'varchar',
    length: 250,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 1500,
  })
  description: string;

  @Column({
    type: 'varchar',
  })
  @IsUrl()
  image: string;

  @Column({
    type: 'array',
  })
  items: Array<string>;
}

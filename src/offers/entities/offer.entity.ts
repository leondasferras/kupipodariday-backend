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
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'varchar',
  })
  user: string;

  @Column({
    type: 'varchar',
  })
  @IsUrl()
  item: string;

  @Column({
    type: 'decimal',
    scale: 2,
  })
  amount: number;

  @Column({
    type: 'boolean',
    default: 'false',
  })
  hidden: boolean;
}

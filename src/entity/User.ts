import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('varchar', { unique: true })
  username: string;

  @Field()
  @Column('varchar', { unique: true })
  email: string;

  @Column('varchar')
  password: string;

  @Column('varchar', { nullable: true })
  resetPasswordToken: string | null;

  @Column('bigint', { nullable: true })
  resetPasswordExpires: number | null;

  @Field()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}

import { ObjectType, Field } from 'type-graphql';
import { User } from '../../../entity/User';

@ObjectType()
export class LoginResponse {
  @Field()
  success: boolean;

  @Field(() => String, { nullable: true })
  token?: string;

  @Field(() => String, { nullable: true })
  errors?: string;
}

@ObjectType()
export class UserResponse {
  @Field()
  success: boolean;

  @Field(() => User, { nullable: true })
  user?: object;

  @Field(() => String, { nullable: true })
  errors?: string;
}

@ObjectType()
export class DeleteResponse {
  @Field()
  success: boolean;

  @Field(() => String, { nullable: true })
  errors?: string;
}

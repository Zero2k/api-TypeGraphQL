import { InputType, Field } from 'type-graphql';

@InputType()
export class SignupInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class ResetInput {
  @Field()
  token: string;

  @Field()
  password: string;

  @Field()
  confirm: string;
}

@InputType()
export class UpdateInput {
  @Field({ nullable: true })
  username: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  password: string;
}

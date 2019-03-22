import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export class PaginateArgs {
  @Field(() => Int)
  page: number = 0;

  @Field(() => Int)
  limit: number = 10;
}

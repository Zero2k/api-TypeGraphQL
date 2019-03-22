import { Resolver, Query, Args } from 'type-graphql';
import { User } from '../../../entity/User';
import { PaginateArgs } from '../shared/user.args';

@Resolver()
export class ProfileResolver {
  @Query(() => [User], { nullable: true })
  async profiles(@Args() { page, limit }: PaginateArgs): Promise<
    User[] | undefined
  > {
    try {
      /* Find all users */
      const users = await User.find({ skip: page, take: limit });

      return users;
    } catch (error) {
      return;
    }
  }
}

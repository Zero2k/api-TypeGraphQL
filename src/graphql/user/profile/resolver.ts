import { Resolver, Query, Arg } from 'type-graphql';
import { User } from '../../../entity/User';

@Resolver()
export class ProfileResolver {
  @Query(() => User, { nullable: true })
  async profile(@Arg('id') id: number): Promise<User | undefined> {
    try {
      /* Find user with id */
      const user = await User.findOne({
        where: { id }
      });

      return user;
    } catch (error) {
      return;
    }
  }
}

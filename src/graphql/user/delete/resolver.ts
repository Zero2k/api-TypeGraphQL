import { Resolver, Mutation, Ctx } from 'type-graphql';
import { User } from '../../../entity/User';
import { NoUserExistsError } from '../shared/user.error';
import { DeleteResponse } from '../shared/user.response';

@Resolver()
export class DeleteResolver {
  @Mutation(() => DeleteResponse)
  async delete(@Ctx('req') req: any): Promise<DeleteResponse> {
    try {
      /* Find user */
      const user = await User.findOne({
        where: { id: req.user.id }
      });

      if (!user) {
        throw new NoUserExistsError();
      }

      await User.remove(user);

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        errors: error.message
      };
    }
  }
}

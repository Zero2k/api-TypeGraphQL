import { Resolver, Arg, Mutation, UseMiddleware, Ctx } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../../../entity/User';
import { NoUserExistsError, InvalidEmailError } from '../shared/user.error';
import { UpdateInput } from '../shared/user.input';
import { UserResponse } from '../shared/user.response';
import { checkAuth } from '../../../utils/checkAuth';
import emailIsValid from '../../../utils/emailIsValid';

@Resolver()
export class UpdateResolver {
  @UseMiddleware(checkAuth)
  @Mutation(() => UserResponse)
  async update(
    @Arg('input')
    { username, email, password }: UpdateInput,
    @Ctx('req') req: any
  ): Promise<UserResponse> {
    try {
      if (email && !emailIsValid(email)) {
        throw new InvalidEmailError();
      }

      /* Find user */
      const user = await User.findOne({
        where: { id: req.user.id }
      });

      if (!user) {
        throw new NoUserExistsError();
      }

      user.username = !username ? user.username : username.toLowerCase();
      user.email = !email ? user.email : email.toLowerCase();
      user.password = !password
        ? user.password
        : await bcrypt.hash(password, 10);

      /* Save new user to database */
      const updatedUser = await User.save(user);

      return {
        success: true,
        user: updatedUser
      };
    } catch (error) {
      return {
        success: false,
        errors: error.message
      };
    }
  }
}

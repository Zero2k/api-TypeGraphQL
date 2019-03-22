import { Resolver, Mutation, Arg } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../../../entity/User';
import { SignupInput } from '../shared/user.input';
import { UserResponse } from '../shared/user.response';
import { UserExistsError, InvalidEmailError } from '../shared/user.error';
import emailIsValid from '../../../utils/emailIsValid';

@Resolver()
export class SignupResolver {
  @Mutation(() => UserResponse)
  async signUp(@Arg('input')
  {
    username,
    email,
    password
  }: SignupInput): Promise<UserResponse> {
    try {
      if (!emailIsValid(email)) {
        throw new InvalidEmailError();
      }

      /* Check if user already exists in db */
      const userExists = await User.findOne({
        where: { email },
        select: ['id']
      });

      if (userExists) {
        throw new UserExistsError();
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        email,
        password: hashPassword
      }).save();

      return {
        success: true,
        user
      };
    } catch (error) {
      return {
        success: false,
        errors: error.message
      };
    }
  }
}

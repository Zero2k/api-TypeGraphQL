import { Resolver, Mutation, Arg } from 'type-graphql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../../entity/User';
import { LoginInput } from '../shared/user.input';
import { LoginResponse } from '../shared/user.response';
import {
  WrongCredentialsError,
  NoUserExistsError,
  InvalidEmailError
} from '../shared/user.error';
import emailIsValid from '../../../utils/emailIsValid';

@Resolver()
export class LoginResolver {
  @Mutation(() => LoginResponse)
  async signIn(
    @Arg('input')
    { email, password }: LoginInput
  ): Promise<LoginResponse> {
    try {
      if (!emailIsValid(email)) {
        throw new InvalidEmailError();
      }

      /* Check if user exists */
      const user = await User.findOne({
        where: { email }
      });

      if (!user) {
        throw new NoUserExistsError();
      }

      /* Check if password is correct */
      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        throw new WrongCredentialsError();
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      const token = jwt.sign(payload, <string>process.env.SECRET, {
        expiresIn: '1d'
      });

      return {
        success: true,
        token
      };
    } catch (error) {
      return {
        success: false,
        errors: error.message
      };
    }
  }
}

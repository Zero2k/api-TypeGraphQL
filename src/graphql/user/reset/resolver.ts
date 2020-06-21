import { Resolver, Arg, Mutation } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../../../entity/User';
import { InvalidTokenError, PasswordMismatch } from '../shared/user.error';
import { MoreThan } from 'typeorm';
import { ResetInput } from '../shared/user.input';
import mailer from '../../../utils/mailer';

@Resolver()
export class ResetResolver {
  @Mutation(() => Boolean)
  async reset(
    @Arg('input') { token, password, confirm }: ResetInput
  ): Promise<Boolean> {
    try {
      /* Find user */
      const user = await User.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: MoreThan(Date.now())
        }
      });

      if (!user) {
        throw new InvalidTokenError();
      }

      /* Check if password match */
      if (password !== confirm) {
        throw new PasswordMismatch();
      }

      const hashPassword = await bcrypt.hash(password, 10);

      user.password = hashPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;

      /* Save token and date to database */
      await User.save(user);

      const body = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Node.js Password Reset',
        text: `You are receiving this because you (or someone else) have reset the password for your account.`
      };

      if (process.env.NODE_ENV === 'production') {
        /* Send email with token */
        mailer(body)
          .then(() => {
            console.log('Email has been sent');
          })
          .catch((error) => {
            console.log(
              `Failed to send the email. Error: ${error && error.message}`
            );
          });
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}

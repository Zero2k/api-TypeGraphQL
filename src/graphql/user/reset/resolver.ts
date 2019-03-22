import { Resolver, Arg, Ctx, Mutation } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../../../entity/User';
import { InvalidTokenError, PasswordMismatch } from '../shared/user.error';
import { MoreThan } from 'typeorm';
import { ResetInput } from '../shared/user.input';
/* import mailer from '../../../utils/mailer'; */

@Resolver()
export class ResetResolver {
  @Mutation(() => Boolean)
  async reset(
    @Arg('input') { token, password, confirm }: ResetInput,
    @Ctx('url') url: string
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
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            ${url}/reset/${token}\n\n`
      };
      body;

      /* Send email with token */
      /* await mailer(body); */

      return true;
    } catch (error) {
      return false;
    }
  }
}

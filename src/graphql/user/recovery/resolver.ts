import { Resolver, Arg, Ctx, Mutation } from 'type-graphql';
import crypto from 'crypto';
import { User } from '../../../entity/User';
import { NoUserExistsError } from '../shared/user.error';
import mailer from '../../../utils/mailer';

@Resolver()
export class RecoveryResolver {
  @Mutation(() => Boolean)
  async recovery(
    @Arg('email') email: string,
    @Ctx('url') url: string
  ): Promise<Boolean> {
    try {
      /* Find user */
      const user = await User.findOne({
        where: { email }
      });

      if (!user) {
        throw new NoUserExistsError();
      }

      /* Create reset token */
      const token = crypto.randomBytes(64).toString('hex');

      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

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

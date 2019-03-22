import nodemailer from 'nodemailer';

const smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD
  }
});

const mailer = (body: any) => {
  const mailOptions = body;

  return new Promise((resolve, reject) => {
    smtpTransport.sendMail(mailOptions, (err: any, info: any) =>
      err ? reject(err) : resolve(info)
    );
  });
};

export default mailer;

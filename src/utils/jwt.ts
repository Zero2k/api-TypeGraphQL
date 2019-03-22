import jwt from 'jsonwebtoken';

const checkJWT = async (req: any, __: any, next: any) => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      const { user }: any = jwt.verify(token, <string>process.env.SECRET);

      req.user = user;
    } catch (err) {
      req.user = null;
    }
  }
  next();
};

export default checkJWT;

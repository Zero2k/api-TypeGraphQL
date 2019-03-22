import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../types/context';

export const checkAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  if (!context.req.user!) {
    throw new Error('Not Authenticated!');
  }

  return next();
};

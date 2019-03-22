import { Request, Response } from 'express';

interface Payload extends Request {
  user: {
    id: number;
  };
}

export interface MyContext {
  req: Payload;
  res: Response;
}

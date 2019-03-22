import 'reflect-metadata';
import 'dotenv/config';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';

import { createSchema } from './utils/createSchema';
import checkJWT from './utils/jwt';
import db from './utils/db';

const createServer = async () => {
  const app = express();

  app.use(checkJWT);

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({
      url: req ? `${req.protocol}://${req.get('host')}` : '',
      req,
      res
    })
  });

  await db();

  apolloServer.applyMiddleware({ app, cors: false, path: '/' });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
  });
};

createServer();

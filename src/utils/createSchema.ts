import { buildSchema } from 'type-graphql';
import path from 'path';
import glob from 'glob';

export const createSchema = () => {
  const pathToGraphQL = path.join(__dirname, '../graphql');

  const resolvers = glob
    .sync(`${pathToGraphQL}/**/resolver.?s`)
    .map(resolver => require(resolver).resolvers);

  return buildSchema({
    resolvers,
    emitSchemaFile: path.resolve(__dirname, '../schema.gql'),
    validate: false
  });
};

import { makeSchema } from 'nexus';
import { Mutation } from './Mutation';
import { Query } from './Query';

export const getSchema = () =>
  makeSchema({
    types: [Query, Mutation],
    outputs: {
      schema: __dirname + '/generated/schema.graphql',
      typegen: __dirname + '/generated/typings.ts',
    },
  });

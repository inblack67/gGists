import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import session from 'express-session';
import cors from 'cors';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import 'colors';
import { getSchema } from './nexus';
import { IContext } from './interfaces';
import { getPrismaClient } from './prisma';
import { isProd } from './utils';

const main = async () => {
  const RedisClient = new Redis();

  const RedisSessionStore = connectRedis(session);
  const store = new RedisSessionStore({ client: RedisClient });

  const app = express();
  const schema = getSchema();
  const prisma = getPrismaClient();

  app.use(cors({ credentials: true }));

  if (isProd()) {
    app.set('trust proxy', 1);
  }

  app.use(
    session({
      store,
      secret: process.env.SESSION_SECRET,
      name: 'micro-feed-session',
      saveUninitialized: false,
      resave: false,
      proxy: isProd(),
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24,
        secure: isProd(),
        domain: process.env.COOKIE_DOMAIN,
      },
    }),
  );

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }): IContext => ({
      req,
      res,
      prisma,
      session: req.session,
      redis: RedisClient,
    }),
    playground: {
      settings: {
        'request.credentials': 'include',
      },
    },
  });

  apolloServer.applyMiddleware({ app, cors: false });

  const PORT = +process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`.green.bold);
  });
};

main().catch((err) => console.error(err));

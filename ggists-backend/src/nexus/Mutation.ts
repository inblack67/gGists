import { mutationType, stringArg } from 'nexus';
import { IContext, ILoginUser, IRegisterUser } from '../interfaces';
import Argon from 'argon2';
import { capitalizeSentence } from '../utils';
import { isAuthenticated } from '../utils/auth';
import {
  INTERNAL_SERVER_ERROR,
  INVALID_CREDENTIALS,
  NOT_AUTHENTICATED,
  NOT_AUTHORIZED,
} from '../utils/constants';

export const Mutation = mutationType({
  description: 'Mutation',
  definition(t) {
    t.boolean('registerUser', {
      args: {
        name: stringArg(),
        email: stringArg(),
        username: stringArg(),
        password: stringArg(),
      },
      resolve: async (_, args: IRegisterUser, ctx: IContext) => {
        const isAlreadyLoggedIn = isAuthenticated(ctx);
        if (isAlreadyLoggedIn) {
          return new Error(NOT_AUTHORIZED);
        }
        try {
          const hashedPassword = await Argon.hash(args.password);
          const user: IRegisterUser = {
            ...args,
            password: hashedPassword,
          };
          await ctx.prisma.user.create({
            data: { ...user },
          });
          return true;
        } catch (err: any) {
          if (err.code === 'P2002') {
            return new Error(
              `${capitalizeSentence(err.meta.target[0])} is already taken`,
            );
          }
          console.log(`Error registering user`.red.bold);
          console.error(err);
          return new Error(INTERNAL_SERVER_ERROR);
        }
      },
    });
    t.boolean('loginUser', {
      args: {
        username: stringArg(),
        password: stringArg(),
      },
      resolve: async (_, args: ILoginUser, ctx: IContext) => {
        const isAlreadyLoggedIn = isAuthenticated(ctx);
        if (isAlreadyLoggedIn) {
          return new Error(NOT_AUTHORIZED);
        }
        try {
          const user = await ctx.prisma.user.findUnique({
            where: {
              username: args.username,
            },
          });
          if (!user) {
            return new Error(INVALID_CREDENTIALS);
          }
          const isCorrectPassword = await Argon.verify(
            user.password,
            args.password,
          );
          if (!isCorrectPassword) {
            return new Error(INVALID_CREDENTIALS);
          }
          ctx.session['username'] = user.username;
          ctx.session['user_id'] = user.id;
          return true;
        } catch (err: any) {
          console.log(`Error logging in user`.red.bold);
          console.error(err);
          return new Error(INTERNAL_SERVER_ERROR);
        }
      },
    });
    t.boolean('logoutUser', {
      resolve: (_, __, ctx: IContext) => {
        const isProtected = isAuthenticated(ctx);
        if (!isProtected) {
          return new Error(NOT_AUTHENTICATED);
        }
        ctx.session.destroy((err) => {
          if (err) {
            console.log(`Error destroying session`.red.bold);
            console.error(err);
          }
        });
        return true;
      },
    });
  },
});

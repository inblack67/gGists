import { queryType } from 'nexus';
import { IContext } from '../interfaces';
import { isAuthenticated } from '../utils/auth';
import { User } from './User';
import { INTERNAL_SERVER_ERROR, NOT_AUTHORIZED } from '../utils/constants';

export const Query = queryType({
  description: 'Greet',
  definition(t) {
    t.string('hello', {
      resolve: () => 'worlds',
    });
    t.list.field('users', {
      type: User,
      resolve: async (_, __, ctx: IContext) => {
        const isProtected = isAuthenticated(ctx);
        if (!isProtected) {
          return new Error(NOT_AUTHORIZED);
        }
        try {
          const users = await ctx.prisma.user.findMany({
            select: {
              email: true,
              id: true,
              username: true,
              name: true,
              password: false,
            },
          });
          return users;
        } catch (err) {
          console.log(`Error fetching users`.red.bold);
          console.error(err);
          return new Error(INTERNAL_SERVER_ERROR);
        }
      },
    });
    t.field('getMe', {
      description: 'Get Me',
      type: User,
      resolve: async (_, __, ctx: IContext) => {
        const isProtected = isAuthenticated(ctx);
        if (!isProtected) {
          return new Error(NOT_AUTHORIZED);
        }
        const user = await ctx.prisma.user.findUnique({
          where: {
            id: +ctx.session.user_id!,
          },
        });
        return user;
      },
    });
  },
});

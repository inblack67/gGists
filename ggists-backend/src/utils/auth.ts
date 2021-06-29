import { IContext } from '../interfaces';

export const isAuthenticated = (ctx: IContext): boolean => {
  if (ctx.session.username) {
    return true;
  }
  return false;
};

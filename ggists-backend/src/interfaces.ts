import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';
import { Redis } from 'ioredis';

export interface ISession extends Session, SessionData {
  username?: string;
  user_id?: string | number;
}

export interface IContext {
  req: Request;
  res: Response;
  prisma: PrismaClient;
  session: ISession;
  redis: Redis;
}

export interface IRegisterUser {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface ILoginUser {
  username: string;
  password: string;
}

declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    SESSION_SECRET: string;
    PORT: string;
    NODE_ENV: string;
  }
}
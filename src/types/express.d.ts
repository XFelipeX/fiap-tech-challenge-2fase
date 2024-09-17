import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    customData?: object;
    viewName?: string;
    status?:number
    userId?: string;
  }
}

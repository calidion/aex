import { Request, Response } from 'express';
import { promisify } from 'util';
import { IAsyncMiddleware, IMiddeleWare } from './aex';

export function toAsyncMiddleware(cb: IMiddeleWare): IAsyncMiddleware {
  return async (req: Request, res: Response) => {
    const promisified = promisify(cb);
    await promisified(req, res);
  };
}

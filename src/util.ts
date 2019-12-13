import { IncomingMessage, ServerResponse } from 'http';
import { promisify } from 'util';
import { IAsyncMiddleware, IMiddeleWare } from './types';

export function toAsyncMiddleware(cb: IMiddeleWare): IAsyncMiddleware {
  return async (req: IncomingMessage, res: ServerResponse) => {
    const promisified = promisify(cb);
    await promisified(req, res);
  };
}

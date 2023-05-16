import assert = require("assert");
import { createServer, RequestListener } from "http";
import { IServer, IServerCreator } from "./types";

export async function start(
  serveringCallback: RequestListener,
  port: number,
  ip: string
): Promise<IServer> {
  const creator: IServerCreator = {
    createServer(options: any, cb: RequestListener): IServer {
      assert(options === null);
      return createServer(cb);
    },
  };
  return customStart(creator, null, serveringCallback, port, ip);
}

export async function customStart(
  creator: IServerCreator,
  options: any,
  serveringCallback: RequestListener,
  port: number,
  ip: string
): Promise<IServer> {
  return new Promise((resolve, reject) => {
    const server = creator.createServer(options, serveringCallback);
    server.listen(port, ip);
    server.on("error", (error: Error) => {
      reject(error);
    });

    server.on("listening", () => {
      resolve(server);
    });
  });
}

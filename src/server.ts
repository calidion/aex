import { createServer, RequestListener } from "http";
import { IServer } from "./types";

export async function start(
  serveringCallback: RequestListener,
  port: number,
  ip: string
): Promise<IServer> {
  return new Promise((resolve, reject) => {
    const server = createServer(serveringCallback);

    server.listen(port, ip);
    server.on("error", (error: Error) => {
      reject(error);
    });

    server.on("listening", () => {
      resolve(server);
    });
  });
}

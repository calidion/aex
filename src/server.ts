import { createServer, RequestListener, Server } from "http";

export async function start(
  serveringCallback: RequestListener,
  port: number,
  ip: string
): Promise<Server> {
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

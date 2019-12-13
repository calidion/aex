import { get, IncomingMessage } from "http";
import Aex from "../src/aex";

function request(url: string): Promise<IncomingMessage> {
  return new Promise(resolve => {
    // This is an example of an http request, for example to fetch
    // user data from an API.
    // This module is being mocked in __mocks__/request.js
    get(url, (response: IncomingMessage) => {
      const data: any[] = [];
      response.on("data", chunk => data.push(chunk));
      response.on("end", () => {
        const value = String(data.join(""));
        const od = Object.getOwnPropertyDescriptor(response, "text");
        if (!od) {
          Object.defineProperty(response, "text", {
            enumerable: true,
            value
          });
        } else {
          od.value = value;
        }
        resolve(response);
      });
    });
  });
}

export async function responseRoutedText(
  aex: Aex,
  url: string,
  message: string
) {
  const port = 10000 + Math.floor(Math.random() * 1000);
  const server = await aex.start(port);
  const res = await request("http://localhost:" + port + url);
  const od = Object.getOwnPropertyDescriptor(res, "text");

  expect(od!.value).toBe(message);
  server.close();
}

export async function responseText(aex: Aex, message: string) {
  const port = 10000 + Math.floor(Math.random() * 1000);
  const server = await aex.start(port);
  const res = await request("http://localhost:" + port);
  const od = Object.getOwnPropertyDescriptor(res, "text");

  expect(od!.value).toBe(message);
  server.close();
}

export async function responseStatus(aex: Aex, url: string, status: number) {
  const port = 10000 + Math.floor(Math.random() * 1000);
  const server = await aex.start(port);
  const res = await request("http://localhost:" + port + url);
  expect(res.statusCode === status).toBeTruthy();
  server.close();
}

test("Placeholder", () => {
  expect(true).toBeTruthy();
});

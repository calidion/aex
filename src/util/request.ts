import { get, IncomingMessage, request } from "http";
import * as qs from "querystring";
import Aex from "../core";

function GET(url: string, options: any): Promise<IncomingMessage> {
  return new Promise(resolve => {
    // This is an example of an http request, for example to fetch
    // user data from an API.
    // This module is being mocked in __mocks__/request.js
    get(url, options, (response: IncomingMessage) => {
      const data: any[] = [];
      response.on("data", chunk => data.push(chunk));
      response.on("end", () => {
        const value = String(data.join(""));
        Object.defineProperty(response, "text", {
          enumerable: true,
          value,
        });
        resolve(response);
      });
    });
  });
}

function POST(options: any, body: any): Promise<IncomingMessage> {
  return new Promise(resolve => {
    // This is an example of an http request, for example to fetch
    // user data from an API.
    // This module is being mocked in __mocks__/request.js

    const postData = qs.stringify(body);
    // console.log(postData);
    options.headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      // tslint:disable-next-line: object-literal-sort-keys
      "Content-Length": Buffer.byteLength(postData),
    };
    options.body = postData;
    const req = request(options, (response: IncomingMessage) => {
      const data: any[] = [];
      response.on("data", chunk => data.push(chunk));
      response.on("end", () => {
        const value = String(data.join(""));
        Object.defineProperty(response, "text", {
          enumerable: true,
          value,
        });
        resolve(response);
      });
    });

    // Write data to request body
    req.write(postData);
    req.end();
  });
}

export async function GetText(
  aex: Aex,
  message: string,
  path: string = "",
  domain: string = "localhost",
  options: any = {}
) {
  const port = 10000 + Math.floor(Math.random() * 1000);

  const server = await aex.start(port);
  const url = "http://" + domain + ":" + port + path;
  const res = await GET(url, options);
  const od = Object.getOwnPropertyDescriptor(res, "text");

  expect(od!.value).toBe(message);
  server.close();
  return res;
}

export async function PostText(
  aex: Aex,
  body: any,
  message: string,
  url: string = "",
  domain: string = "localhost",
  method: string = "POST"
) {
  const port = 10000 + Math.floor(Math.random() * 1000);
  const server = await aex.start(port);
  const options = {
    hostname: domain,
    port,
    // tslint:disable-next-line: object-literal-sort-keys
    path: url,
    method,
  };
  const res = await POST(options, body);
  const od = Object.getOwnPropertyDescriptor(res, "text");

  expect(od!.value).toBe(message);
  server.close();
  return res;
}

export async function GetStatus(
  aex: Aex,
  url: string,
  status: number,
  domain: string = "localhost",
  options: any = {}
) {
  const port = 10000 + Math.floor(Math.random() * 1000);
  const server = await aex.start(port);
  const res = await GET("http://" + domain + ":" + port + url, options);
  expect(res.statusCode === status).toBeTruthy();
  server.close();
  return res;
}

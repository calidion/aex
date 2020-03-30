import { get, IncomingMessage, request } from "http";
import * as qs from "querystring";
import Aex from "../core";

function GET(options: any): Promise<IncomingMessage> {
  return new Promise(resolve => {
    // This is an example of an http request, for example to fetch
    // user data from an API.
    // This module is being mocked in __mocks__/request.js
    get(options, (response: IncomingMessage) => {
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

export async function GetTextWithAex(
  aex: Aex,
  message: string,
  path: string = "",
  domain: string = "localhost",
  options: any = {}
) {
  const port = await initRandomPort(aex);
  const res = await GetText(port, message, path, domain, options);
  aex.server!.close();
  return res;
}

export async function GetText(
  port: number,
  message: string,
  path: string,
  domain: string = "localhost",
  options: any = {}
) {
  Object.assign(options, {
    hostname: domain,
    port,
    // tslint:disable-next-line: object-literal-sort-keys
    path,
    method: "GET",
  });
  const res = await GET(options);
  const od = Object.getOwnPropertyDescriptor(res, "text");

  expect(od!.value).toBe(message);
  return res;
}

export async function PostText(
  port: number,
  body: any,
  message: string,
  url: string = "",
  domain: string = "localhost",
  method: string = "POST"
) {
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
  return res;
}

export async function GetStatus(
  port: number,
  url: string,
  status: number,
  domain: string = "localhost",
  options: any = {}
) {
  Object.assign(options, {
    hostname: domain,
    port,
    // tslint:disable-next-line: object-literal-sort-keys
    path: url,
    method: "GET",
  });
  const res = await GET(options);
  expect(res.statusCode === status).toBeTruthy();
  return res;
}

export async function GetStatusWithAex(
  aex: Aex,
  url: string,
  status: number,
  domain: string = "localhost",
  options: any = {}
) {
  const port = await initRandomPort(aex);
  const res = await GetStatus(port, url, status, domain, options);
  aex.server!.close();
  return res;
}

export async function initRandomPort(aex: Aex) {
  const port = 10000 + Math.floor(Math.random() * 1000);
  await aex.start(port);
  return port;
}

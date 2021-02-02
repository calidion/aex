/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */

import { get, IncomingMessage, request } from "http";
import * as qs from "querystring";
import Aex from "../core";

export function GET(options: any): Promise<IncomingMessage> {
  return new Promise((resolve) => {
    // This is an example of an http request, for example to fetch
    // user data from an API.
    // This module is being mocked in __mocks__/request.js
    get(options, (response: IncomingMessage) => {
      const data: any[] = [];
      response.on("data", (chunk) => data.push(chunk));
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

export function POST(options: any, body: any): Promise<IncomingMessage> {
  return new Promise((resolve) => {
    // This is an example of an http request, for example to fetch
    // user data from an API.
    // This module is being mocked in __mocks__/request.js

    const postData = qs.stringify(body);
    // console.log(postData);
    if (!options.headers) {
      options.headers = {};
    }
    Object.assign(options.headers, {
      "Content-Type": "application/x-www-form-urlencoded",
      // tslint:disable-next-line: object-literal-sort-keys
      "Content-Length": Buffer.byteLength(postData),
    });
    options.body = postData;
    const req = request(options, (response: IncomingMessage) => {
      const data: any[] = [];
      response.on("data", (chunk) => data.push(chunk));
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

export async function Get(
  port: number,
  path: string,
  domain: string,
  options: any
) {
  Object.assign(options, {
    hostname: domain,
    port,
    // tslint:disable-next-line: object-literal-sort-keys
    path,
    method: "GET",
  });
  return GET(options);
}

export async function Post(
  port: number,
  body: any,
  url: string,
  domain: string,
  options: any
) {
  options.hostname = domain;
  options.port = port;
  options.path = url;
  options.method = "POST";
  return POST(options, body);
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
  options: any = {},
  compare: boolean = true
) {
  const res = await Get(port, path, domain, options);
  const od = Object.getOwnPropertyDescriptor(res, "text");

  if (compare) {
    expect(od!.value).toBe(message);
  }
  return res;
}

export async function PostText(
  port: number,
  body: any,
  message: string,
  url: string = "",
  domain: string = "localhost",
  method: string = "POST",
  options: any = {},
  compare: boolean = true
) {
  options.hostname = domain;
  options.port = port;
  options.path = url;
  options.method = method;
  const res = await Post(port, body, url, domain, options);
  const od = Object.getOwnPropertyDescriptor(res, "text");

  if (compare) {
    expect(od!.value).toBe(message);
  }
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

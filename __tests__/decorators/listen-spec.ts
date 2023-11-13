// import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import { EventEmitter } from "stream";
import { Aex, listen, get, Scope, GetText } from "../../src/index";

import { initRandomPort } from "../../src/index";

class Listen {
  private name: string;
  constructor(name?: string) {
    this.name = name || "";
  }
  @listen("echo")
  public echo(emitter: EventEmitter, ...messages: any[]) {
    emitter.emit("echoed", messages[0]);
  }

  @get("/")
  public async get(_req: any, res: any, scope: Scope) {
    scope.emitter.on("echoed1", (mesasge) => {
      res.end(mesasge + " from " + this.name);
    });
    scope.emitter.emit("echo1", "Hello");
  }
}

class Listen1 {
  @listen("echo1")
  public echo1(emitter: EventEmitter, ...messages: any[]) {
    emitter.emit("echoed1", "echoed1 " + messages[0]);
  }
}

const emitter = new EventEmitter();
const aex = new Aex(emitter);
let port: number = 0;

aex.push(Listen, "Nude");
aex.push(Listen1);
aex.prepare();

beforeAll(async () => {
  port = await initRandomPort(aex);
});

test("Should send message directly", (done) => {
  emitter.on("echoed", () => {
    done();
  });
  emitter.emit("echo", "Hello Aex!");
});

test("Should send events through", async () => {
  await GetText(port, "echoed1 Hello from Nude", "/", "localhost");
});

afterAll(async () => {
  aex.server?.close();
});

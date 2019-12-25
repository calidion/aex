import * as WebSocket from "ws";
import { Aex } from "../src/core";
import { WebSocketServer } from "../src/websocket/server";

test("Should support websocket", done => {
  const aex = new Aex();
  aex.start().then(server => {
    const ws = new WebSocketServer(server);

    ws.on(WebSocketServer.ENTER, () => {
      ws.close();
      server.close();
      done();
    });
    const wsc: WebSocket = new WebSocket("ws://localhost:3000/path");

    wsc.on("open", function open() {
      wsc.send("");
    });
  });
});

test("Should send websocket json", done => {
  const aex = new Aex();
  aex.start().then(server => {
    const ws = new WebSocketServer(server);

    ws.on("new", (data: any) => {
      data.name = "I";
      ws.close();
      server.close();
      done();
    });
    const wsc: WebSocket = new WebSocket("ws://localhost:3000/path");

    wsc.on("open", function open() {
      wsc.send(
        JSON.stringify({
          data: {
            name: "I"
          },
          event: "new"
        })
      );
    });
  });
});

test("Should error on wrong json", done => {
  const aex = new Aex();

  aex.start().then(server => {
    const ws = new WebSocketServer(server);

    ws.on("error", (data: any) => {
      data.raw = "Hello";
      ws.close();
      server.close();
      done();
    });
    const wsc: WebSocket = new WebSocket("ws://localhost:3000/path");

    wsc.on("open", function open() {
      wsc.send("Hello");
    });
  });
});

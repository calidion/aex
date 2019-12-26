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

    ws.on(WebSocketServer.ENTER, (handler) => {
      handler.on("new", (data: any) => {
        data.name = "I";
        ws.close();
        server.close();
        done();
      });
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

    ws.on(WebSocketServer.ENTER, (handler) => {
      handler.on("error", (data: any) => {
        data.raw = "Hello";
        ws.close();
        server.close();
        done();
      });
    });
    const wsc: WebSocket = new WebSocket("ws://localhost:3000/path");

    wsc.on("open", function open() {
      wsc.send("Hello");
    });
  });
});

test("Should use middleware", done => {
  const aex = new Aex();

  aex.start().then(server => {
    const ws = new WebSocketServer(server);

    ws.use(async () => {
      return true;
    });

    ws.on(WebSocketServer.ENTER, (handler) => {
      expect(handler.scope).toBeTruthy();
      expect(handler.scope.outer.req).toBeTruthy();
      expect(handler.scope.outer.ws).toBeTruthy();
      handler.on("error", (data: any) => {
        data.raw = "Hello";
        ws.close();
        server.close();
        done();
      });
    });
    const wsc: WebSocket = new WebSocket("ws://localhost:3000/path");

    wsc.on("open", function open() {
      wsc.send("Hello");
    });
  });
});

test("Should use middleware false", done => {
  const aex = new Aex();

  aex.start().then(server => {
    const ws = new WebSocketServer(server);

    ws.use(async () => {
      return false;
    });

    ws.on(WebSocketServer.ENTER, (handler) => {
      handler.on("error", (data: any) => {
        data.raw = "Hello";
        ws.close();
        server.close();
      });
    });


    setTimeout(() => {
      ws.close();
      server.close();
      done();   
    }, 1000);

    const wsc: WebSocket = new WebSocket("ws://localhost:3000/path");

    wsc.on("open", function open() {
      wsc.send("Hello");
    });
  });
});

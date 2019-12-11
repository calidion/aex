[![Build Status](https://travis-ci.com/calidion/aex.svg?branch=master)](https://travis-ci.com/calidion/aex)
[![Coverage Status](https://coveralls.io/repos/github/calidion/aex/badge.svg?branch=master)](https://coveralls.io/github/calidion/aex?branch=master)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# AEX: The async express

A very simple wrap on express to support async / await syntax.

# Install

```
npm i @aex/core
```
or
```
yarn add @aex/core
```

## A simple way to start

### Define the option

The option is a composition of a `method`, a `url`, a `handler` and `middlewares`.

where:

the `method` is the http method,

the `url` is an express supported url,

the `handler` is an async function `IAsyncHandler` which defined as follows:

```ts
export type IAsyncMiddleware = (
  req: Request,
  res: Response
) => Promise<boolean | undefined | null | void>;
export type IAsyncHandler = IAsyncMiddleware;
```

the `middlewares` is an array of async functions which are executed in order. The async function is of the same format to the handler but called `IAsyncMiddleware` for distinguish only.

> middlewares can return `false` to stop further execution

# Usage

## 1. Create an Aex instance

```ts
const aex = new Aex();
```

or

```ts
// with express app pre-created;
import * as express from "express";
const app = express();
const aex = new Aex(app);
// aex.app === app
```

> you can get express app any time by using `aex.app` attribute

## 2. Setup the option for handler

```ts
const options = {
  method: "get",
  url: "/",
  handler: async (req, res) => {
    res.send("Hello world!");
  }
};

aex.handle(options);
```

## 3. Prepare the server

```ts
aex.prepare();
```

## 4. Start the server

```ts
const port = 3000;
const host = "localhost";
const server = await aex.start(port, host);
// server === aex.server
```

# Middlewares

## Global middlewares

Global middlewares are effective allover the http request process.

It can be added by `aex.use` function.

```ts
aex.use(async (req, res) => {
  // process 1
  // return false
});

aex.use(async (req, res) => {
  // process 2
  // return false
});

// ...

aex.use(async (req, res) => {
  // process N
  // return false
});
```

> Return `false` in middleware will cancel the whole http request processing,  
> It is normally after a `res.end`

## Handle specific middlewares

Handle specific middlewares are effective only to the specific handler.

It can be optionally added to the handle option via the optional attribute `middlewares`.

the `middlewares` attribute is an array of async functions of `IAsyncMiddleware` which defined as follows:

```ts
export type IAsyncMiddleware = (
  req: Request,
  res: Response
) => Promise<boolean | undefined | null | void>;
```

so we can simply define handle specific middlewares as follows:

```ts
const options = {
  method: "get",
  url: "/",
  handler: async (req, res) => {
    res.send("Hello world!");
  },
  middlewares: [
    async (req, res) => {
      // process 1
      // return false
    },
    async (req, res) => {
      // process 2
      // return false
    },
    // ...,
    async (req, res) => {
      // process N
      // return false
    }
  ]
};

aex.handle(options);
```

# Accessable members

## app

The Application instance of express.

```ts
const app = express();
const aex = new Aex(app);
expect(aex.app === app).toBeTruthy();
```

## server

The node system server.

```ts
const aex = new Aex();
const server = await aex.start();
expect(server === aex.server).toBeTruthy();
server.close();
```

# Inherite middlewares from expressjs

For most expressjs middlewares it should work perfectly well with Aex.

Normally it is enough you just make it promisified.

Here is an example(`express` old style middleware):

```ts
const oldMiddleware = (_req: any, _res: any, next: any) => {
  // ...
  next();
};

const pOld = promisify(oldMiddleware);
aex.use(pOld as IAsyncMiddleware);
```

For more complicated ones, you may need to `bind` the object to avoid `this` pointer swifting.

Here is an example(`express-session` middleware)::

```ts
import * as session from "express-session";
const asession = session({
  secret: "keyboard cat"
});
const psession = promisify(asession.bind(asession));
aex.use(psession as IAsyncMiddleware);
```

> you should be caution to use such middlewares, test before using them.

# A full simple example

```ts
import { Aex } from "@aex/core";

const aex = new Aex();

const options = {
  method: "get",
  url: "/",
  handler: async (req, res) => {
    res.send("Hello Aex!");
  }
};

aex.handle(options);

aex.prepare();

const port = 3000;
const host = "localhost";
aex.start(port, host).then();
```

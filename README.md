[![Build Status](https://travis-ci.com/calidion/aex.svg?branch=master)](https://travis-ci.com/calidion/aex)
[![Coverage Status](https://coveralls.io/repos/github/calidion/aex/badge.svg?branch=master)](https://coveralls.io/github/calidion/aex?branch=master)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# AEX: The async express

A very simple wrap on express to support async / await syntax.

# Usage

## Simplest way to start

### Define a handler

A handler is a composition of a method, a url, a handler and middlewares.

where:

the method is the http method,

the url is a express supported url,

the handler is an async function with two parameters, `async (req, res) => {}`

the middlewares is an array of async functions which are executed in order. The async function is of the same format to the handler.

> middlewares can return `false` to stop further execution.

### A simple example:

```ts
const handler = {
  method: "get",
  url: "/",
  handler: async (req, res) => {
    res.send("Hello world!");
  }
};
```

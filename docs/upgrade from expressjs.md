The following content is trying to tell you how to upgrade to [aex](https://github.com/calidion/aex) from expressjs, If you feel comfortable with aex new features. 

# When your would upgrade from expressjs?

1. Use async/await directly.
2. Simplify your code with decorator, helper.
3. Programming web in the object oriented way.
4. Avoid callback function `next` in your code, even when async/await is introduced.
5. Make you compatible with native node.js http server.
6. To have a builtin error processing system.
7. To have a builtin data filtering system.
8. Don't want to write too much duplicated code.
9. Want to focus your business logic.

# What is the main differences between aex and expressjs?

1. Aex is an upgrade in syntax with Typescript and ESNext.
2. Aex extended the expressjs by replacing the callback function`next` with the data carrier `scope`.
3. Aex can be programmed in the objected oriented way with decorators.
4. Aex don't have cascaded routing system. Aex use flat routing system. All route must be specified absolutely.

Here is a simple example of how aex handler could be:

```ts
class UserLoginHandler {
  @post("/user/login")
  public async login(req, res, scope) {
    const { username, password } = scope.body;
  }
}
```

# How to translate?

## Route translate

For express code:

`app.get(url, handler)` should be translated to member function:

```ts
class Handler {
  @get(url)
  public handler() {}
}
```

> All cascaded routes must be absolutized.

## Middleware migration

Most express middlewares should be workable with aex by converting to aex middlewares with function `toAsyncMiddleware`.

Aex provides one function `use` and one decorator `@inject` to use middlewares through the web development process.

It use the same function `use` as express to take middleware.

```ts
const aex = new Aex();
aex.use(toAsyncMiddleware(yourMiddleware));
```

Middlewares can also be used with the `@inject` decorator.

```ts
const aex = new Aex();
aex.use(toAsyncMiddleware(yourMiddleware));
```

## Simplify your process with decorators and helpers

Web handler can be secured, accelerated and simplified with decorators and helpers.

Here is an example:

```ts
class UserLoginHandler {
  @post("/user/login")
  @body()
  @filter({
    body: {
      username: {
        type: string,
        minLength: 4,
        required: true,
      },
      password: {
        type: string,
        required: true,
      },
    },
    fallbacks: {
      body: errorInput
    }
  })
  public async login(req, res, scope) {
    const { username, password } = scope.body;
  }

  @get("/user/profile")
  @session()
  @inject(logined, NotLoginFallback)
  public async login(req, res, scope) {
    const { session: {user} } = scope;
  }

  @get("/users")
  @query()
  @inject(paginate)
  public async login(req, res, scope) {
    const { pagination: {page, limit, offset} } = scope;
  }
}
```

## Boot up

Boot up is one step more than express.

```ts
const aex = new Aex();
aex.prepare().start();
```

Click the links to know more about [start](https://github.com/calidion/aex/README.md#start) and [aex](https://github.com/calidion/aex);

# Final Statement

Aex is still on itS early stage. You're risk at your own:)

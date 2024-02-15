# Aex API Development Support

## Aex currently support restful api and vig api

1. Restful API for resources state representation
2. Vig API for Business logic manipuliation

the usage similar with decorator @rest and @api.
Which means @api is a recommendded api for most applications which is suitable for business logic.

### @rest

@rest decorator can help directing every request into a certain method according to its http method and with default body parser.

It is very simple to use just like other aex handlers:

```ts
class Rest {
  public async get(ctx: any) {}
  public async post(ctx: any) {}
  public async put(ctx: any) {}
  public async patch(ctx: any) {}
  public async delete(ctx: any) {}
  @rest("/rest/api")
  public api(ctx: any) {
    ctx.res.end("Rest API !");
  }
}
```

currently only five http methods(`get`, `post`, `put`, `patch`, `delete`) are allowed.

### @api

@api decorator only supports `get`, `post` http methods. `get` is used for information fetch without changing anything, `post` is used for any business action may potantially change something.

the usage is very similiar except the http post request is force to have a field called `action`, which is the business action.
Actions can be any string and you should write corresponding method to handle that action. (Actions are case sensitive.)

for example, we need to write an api for user, we can define an api with @api like the following:

```ts
class UserAPI {
  public async register(ctx) {}
  public async login(ctx) {}
  public async logout(ctx) {}
  public async remove(ctx) {}
  public async update(ctx) {}

  @api("/user")
  public api(ctx: any) {
    ctx.res.end("VIG API");
  }
}
```

by sending `action`, the decorator will automatic route your request into corresponding method.

Further infomation and update about vig api can be found here:
https://github.com/calidion/vig-api

these decorators will be enhance overtime, and you can file a feature request any time.

basic aex usage can be found in README file:
https://github.com/calidion/aex

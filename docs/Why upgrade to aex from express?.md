Express is very good lightweight web framework for node.js with a very large community.
It is ease to start and very extensible.

## Problems with Express
But it has some problems:

1. It hasn't been update for years

express v5 has not been waited for years. 

2. Lacking of some very important features introduced by node.js and ecma new versions.
One of the most important features is the async/await support.

3. callback paradigm is somewhat unclear for large projects.
a non-intrusive and adherent web framework is somewhat more clear and easier for large projects to be well organised.

## Why other similar projects cannot take over express's project?

express is a very basic web framework, there are only a few similar projects, like koa, fastify

### Koa

Koa is a wrong implementation for promise/async/await.
Koa breaks old express middlewares, takes a lot effort but gain nothing.
Koa introduced a false middleware structure.
So there are not many projects choose it.

### fastify

Fastify is incompatible with express middlewares, and has its own way to construct a web server.

### Other complicated web frameworks is too opinionated.

And MVC is surely not a good place for web frameworks.
Most MVC frameworks are not correct as web frameworks.
Becuase Web frameworks only process request, response, that is to say, process data (such as json, html, xml, and txt) and logic, there are no direct mvc interaction for web frameworks.
And the controller is not a proper name for web processing functions/classes.

## Why use aex?

1. Aex uses a new paradigm called Web Straight Line instead of MVC, which is more fix the web processing model, and focus on the web flow and common web processing. 
2. Aex is compatible with almost all express middlewares.
3. Aex is faster, decoratable, non-intrusive, adherent. Which a lot of built-in deocrators, you can greatly improve your working effiency.
4. Aex is about 1.5x more faster than expressjs due to a dependent router, which is far from optimized.
5. Aex is decoratable to classes which makes it non-intrusive and adherent. It will not interfere with business logic, only handles rountine web logic, which follows the Web Straight Line paradigm. Your can first organize your business logic then add web handlers as needed.

```ts
class BussinessLogic {
   businessLogic1();
   businessLogic2();
   ...
   businessLogicN();
   
   @http(...) 
   // common web logics here
   webHandle1();
      
   @http(...) 
   // common web logics here
   webHandle2();
}
```

6. It is almost painless to convert expressjs projects to aex ones.










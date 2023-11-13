import { GetText, initRandomPort } from "../../src";
import { Aex, http } from "../../src/index";

class A {
  @http("/", undefined, true)
  public a(ctx: any) {
    return ctx.res.json({ sss: "aoaoa", b: 1 });
  }
}

const aex = new Aex();

aex.push(A);
aex.prepare();

let port: number = 0;

beforeAll(async () => {
  port = await initRandomPort(aex);
});
test("Should turn object into json string", async () => {
  await GetText(port, '{"sss":"aoaoa","b":1}', "/", "localhost");
});

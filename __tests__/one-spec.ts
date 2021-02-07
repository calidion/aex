import { One, Aex, http } from "../src/index";

test("One should put instances and get them correctly", async () => {
  class A {
    @http("/aa")
    public a() {
      return "aa";
    }

    @http("/ab")
    public b() {
      return "ab";
    }
  }
  class B {
    @http("/ba")
    public a() {
      return "ba";
    }

    @http("/bb")
    public b() {
      return "bb";
    }
  }

  const aex = new Aex();

  aex.push(A);
  aex.push(B);
  aex.prepare();

  let catched = false;
  try {
    One.putInstance(A.prototype.constructor.name, "a", new A());
  } catch (e) {
    catched = true;
    expect(e.message).toBe("Duplicated instance found!");
  }
  expect(catched).toBeTruthy();

  const iaa = One.getInstance(A.prototype.constructor.name, "a");
  const iab = One.getInstance(A.prototype.constructor.name, "b");
  const iac = One.getInstance("ddo", "c");

  expect(iac).toBeFalsy();
  expect(iaa === iab).toBeTruthy();

  const oneInstance = One.instance();

  const instances = One.instances;
  expect(Object.keys(instances).length === 2);
  One.reset();
  const afterInstance = One.instance();
  expect(oneInstance !== afterInstance);
  expect(Object.keys(One.instances).length === 0);
});

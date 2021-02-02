import { One } from "../src/one";

test("One should put instances and get them correctly", async () => {
  class A {
    public a() {
      return "aa";
    }
    public b() {
      return "ab";
    }
  }
  class B {
    public a() {
      return "ba";
    }
    public b() {
      return "bb";
    }
  }

  const a = new A();
  const b = new B();

  One.putInstance(A, "a", a);
  One.putInstance(A, "b", a);
  One.putInstance(B, "a", b);
  One.putInstance(B, "b", b);

  let catched = false;
  try {
    One.putInstance(A, "a", a);
  } catch (e) {
    catched = true;
    expect(e.message).toBe("Duplicated instance found!");
  }
  expect(catched).toBeTruthy();

  const iaa = One.getInstance(A, "a");
  const iab = One.getInstance(A, "b");
  const iac = One.getInstance("ddo", "c");

  expect(iac).toBeFalsy();
  expect(iaa === iab).toBeTruthy();
  expect(a === iaa).toBeTruthy();

  const oneInstance = One.instance();

  const instances = One.instances;
  expect(Object.keys(instances).length === 2);
  One.reset();
  const afterInstance = One.instance();
  expect(oneInstance !== afterInstance);
  expect(Object.keys(One.instances).length === 0);
});

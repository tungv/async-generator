const take = require(".");
const interval = require("@async-generator/interval");

it("should take n items and stop", async () => {
  const input = interval(10);

  const output = take(input, 5);

  const actual = [];

  for await (const i of output) {
    actual.push(i);
  }

  expect(actual).toEqual([0, 1, 2, 3, 4]);
});

it("should end if generator ends", async () => {
  async function* input() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
  }

  const output = take(input(), 10);
  const actual = [];

  for await (const i of output) {
    actual.push(i);
  }

  expect(actual).toEqual([1, 2, 3, 4]);
});

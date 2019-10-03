const map = require(".");

const interval = require("@async-generator/interval");
const take = require("@async-generator/take");

it("should map", async () => {
  const input = take(interval(100), 5);
  const output = map(input, x => x * x);

  const actual = [];

  for await (const item of output) {
    actual.push(item);
  }

  expect(actual).toEqual([0, 1, 4, 9, 16]);
});

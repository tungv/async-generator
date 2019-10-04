const interval = require(".");
const take = require("@async-generator/take");

it("should tick every fixed amount of miliseconds", async () => {
  const start = Date.now();
  const input = interval(100, i => {
    return {
      i,
      time: Date.now() - start,
    };
  });

  const actual = [];

  for await (const value of take(input, 5)) {
    actual.push(value);
  }

  expect(Math.round(actual[0].time / 100)).toBe(1);
  expect(Math.round(actual[1].time / 100)).toBe(2);
  expect(Math.round(actual[2].time / 100)).toBe(3);
  expect(Math.round(actual[3].time / 100)).toBe(4);
  expect(Math.round(actual[4].time / 100)).toBe(5);
});

it("should return integers from 0 when mapFn is omitted", async () => {
  const input = interval(10);

  const actual = [];

  for await (const value of take(input, 5)) {
    actual.push(value);
  }

  expect(actual).toEqual([0, 1, 2, 3, 4]);
});

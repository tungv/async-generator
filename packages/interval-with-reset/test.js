const intervalWithReset = require(".");
const take = require("@async-generator/take");

it("should tick every fixed amount of miliseconds", async () => {
  const start = Date.now();
  const [iterator] = intervalWithReset(100, i => {
    return {
      i,
      time: Date.now() - start,
    };
  });

  const actual = [];

  for await (const value of take(iterator, 5)) {
    actual.push(value);
  }

  expect(Math.round(actual[0].time / 100)).toBe(1);
  expect(Math.round(actual[1].time / 100)).toBe(2);
  expect(Math.round(actual[2].time / 100)).toBe(3);
  expect(Math.round(actual[3].time / 100)).toBe(4);
  expect(Math.round(actual[4].time / 100)).toBe(5);
});

it("should reset tick when reset is called", async () => {
  const start = Date.now();
  const [iterator, reset] = intervalWithReset(100, i => {
    return {
      i,
      time: Date.now() - start,
    };
  });

  const actual = [];

  for await (const value of take(iterator, 5)) {
    actual.push(value);
    if (actual.length === 3) {
      await sleep(60);
      reset();
      await sleep(60);
      reset();
    }
  }

  expect(Math.round(actual[0].time / 100)).toBe(1);
  expect(Math.round(actual[1].time / 100)).toBe(2);
  expect(Math.round(actual[2].time / 100)).toBe(3);
  expect(Math.round(actual[3].time / 100)).toBe(5);
  expect(Math.round(actual[4].time / 100)).toBe(6);
});

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

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

  for await (let i of take(iterator, 5)) {
    actual.push(i);
  }

  expect(actual[0].time / 10000).toBeCloseTo(0.01, 2);
  expect(actual[1].time / 10000).toBeCloseTo(0.02, 2);
  expect(actual[2].time / 10000).toBeCloseTo(0.03, 2);
  expect(actual[3].time / 10000).toBeCloseTo(0.04, 2);
  expect(actual[4].time / 10000).toBeCloseTo(0.05, 2);
});

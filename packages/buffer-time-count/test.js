const bufferTimeOrCount = require(".");
const take = require("@async-generator/take");

it("should buffer by time or count", async () => {
  const output = [];
  const input = every(100, 50, 100, 10, 10, 10, 250, 500, 10);
  const buffer = bufferTimeOrCount(input, 200, 3);

  const limitedBuffer = take(buffer, 7);

  for await (const buffer of limitedBuffer) {
    output.push(buffer);
  }

  expect(output).toEqual([[0, 1], [2, 3, 4], [5], [6], [], [7, 8], []]);
});

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function* every(...times) {
  let i = 0;
  while (i < times.length) {
    await sleep(times[i]);
    yield i++;
  }
}

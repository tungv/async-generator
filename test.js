const bufferTimeOrCount = require(".");

it("should buffer by time or count", async () => {
  const output = [];
  for await (const buffer of bufferTimeOrCount(
    every(100, 50, 100, 1, 1, 1, 250, 500, 10),
    200,
    3,
  )) {
    output.push(buffer);
  }

  expect(output).toEqual([[0, 1], [2, 3, 4], [5], [6], [], [], [7, 8]]);
});

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function* every(...times) {
  let i = 0;
  while (i < times.length) {
    await sleep(times[i]);

    if (i === times.length - 1) {
      return i;
    }
    yield i;
    i++;
  }
}

const concurrent = require(".");

it("should buffer by time or count", async () => {
  const output = [];
  const input = fromArray([101, 52, 103, 14, 15, 16, 257, 508, 19]);

  let concurrentWorks = 0;
  let maximumWorks = 0;

  async function work(ms) {
    concurrentWorks++;
    maximumWorks = Math.max(concurrentWorks, maximumWorks);
    await sleep(ms);
    concurrentWorks--;
    return ms;
  }

  let duration = Date.now();
  for await (const i of concurrent(input, 2, work)) {
    output.push(i);
  }
  duration = Date.now() - duration;

  // 0                101ms    115ms     130ms   146ms              403ms    422ms
  // | <-- 101 ------> | <-14-> | <-15-> | <-16-> | <-- 257 -------> | <-19-> X
  // | <--52--> | <-- 103 ------------------------> | <-- 508 --------------------> X
  //           52ms                                155ms                           663ms
  expect(output).toEqual([52, 101, 14, 15, 16, 103, 257, 19, 508]);
  expect(maximumWorks).toEqual(2);
  expect(duration >= 663 && duration <= 683);
});

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function* fromArray(array) {
  let i = 0;
  while (i < array.length) {
    yield array[i++];
  }
}

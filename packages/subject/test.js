const subject = require(".");

it("should feed", async () => {
  const [iterator, feed, end] = subject();

  sleep(100).then(async () => {
    feed(1);
    await sleep(100);
    feed(2);

    await sleep(100);
    feed(3);

    await sleep(100);
    feed(4);

    end();
  });

  const actual = [];

  for await (const item of iterator) {
    actual.push(item);
    await sleep(200);
  }

  expect(actual).toEqual([1, 2, 3, 4]);
});

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

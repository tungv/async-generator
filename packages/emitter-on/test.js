const { EventEmitter } = require("events");
const on = require(".");

it("should iterate through event emissions", async () => {
  const emitter = new EventEmitter();
  const output = [];
  let counter = 0;

  const promise = (async function() {
    for await (const data of on(emitter, "test")) {
      output.push(data);
      ++counter;

      if (counter === 3) {
        break;
      }
    }
  })();

  emitter.emit("test", { id: 1 });
  emitter.emit("test", { id: 2 });
  await sleep(10);
  emitter.emit("test", { id: 3 });
  await sleep(50);
  emitter.emit("test", { id: 4 });

  await promise;

  expect(output).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
});

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

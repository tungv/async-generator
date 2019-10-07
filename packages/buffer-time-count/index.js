const merge = require("@async-generator/merge");
const intervalWithReset = require("@async-generator/interval-with-reset");

const TIMEOUT = Symbol("timeout");

module.exports = async function* bufferTimeCount(iter, time, count) {
  const buffer = [];
  const [timeout$, reset] = intervalWithReset(time, () => TIMEOUT);

  try {
    for await (const itemOrTimeout of merge(timeout$, iter)) {
      // timeout branch
      if (itemOrTimeout === TIMEOUT) {
        reset();
        yield [...buffer];
        buffer.length = 0;
        continue;
      }

      // item branch
      buffer.push(itemOrTimeout);

      if (buffer.length >= count) {
        reset();
        yield [...buffer];
        buffer.length = 0;
      }
    }
  } finally {
    // flush all leftover
    yield buffer;
  }
};

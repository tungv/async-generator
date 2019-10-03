const merge = require("@async-generator/merge");
const interval = require("@async-generator/interval");

const TIMEOUT = Symbol("timeout");

module.exports = async function* bufferTimeCount(iter, time, count) {
  const buffer = [];
  const timeout$ = interval(time, () => TIMEOUT);

  try {
    for await (const itemOrTimeout of merge(timeout$, iter)) {
      // timeout branch
      if (itemOrTimeout === TIMEOUT) {
        yield [...buffer];
        buffer.length = 0;
        continue;
      }

      // item branch
      buffer.push(itemOrTimeout);

      if (buffer.length >= count) {
        yield [...buffer];
        buffer.length = 0;
      }
    }
  } finally {
    // flush all leftover
    yield buffer;
  }
};

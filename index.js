module.exports = async function* bufferTimeCount(iter, time, count) {
  const buffer = [];
  let next = iter.next();
  let timeout = sleep(time);

  try {
    while (true) {
      const itemOrTimeout = await Promise.race([timeout, next]);

      // timeout branch
      if (typeof itemOrTimeout === "undefined") {
        yield [...buffer];
        buffer.length = 0;
        timeout = sleep(time);
        continue;
      }

      // item branch
      buffer.push(itemOrTimeout.value);

      if (buffer.length >= count) {
        yield [...buffer];
        buffer.length = 0;
      }

      // condition to end or continue to capture item
      if (itemOrTimeout.done === true) {
        break;
      }
      next = iter.next();
    }
  } finally {
    // flush all leftover
    yield [...buffer];
    buffer.length = 0;
    iter.return();
  }
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

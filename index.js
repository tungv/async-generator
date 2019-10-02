const TIMEOUT = Symbol("timeout");

module.exports = async function* bufferTimeCount(iter, time, count) {
  const buffer = [];
  const timeout$ = map(interval(time), () => TIMEOUT);

  try {
    for await (const itemOrTimeout of race(timeout$, iter)) {
      // timeout branch
      if (itemOrTimeout.value === TIMEOUT) {
        yield [...buffer];
        buffer.length = 0;
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
    }
  } finally {
    // flush all leftover
    yield buffer;
  }
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function* race(...iters) {
  const promises = iters.map(async (it, index) => ({
    index,
    next: await it.next(),
  }));
  let endCount = 0;

  while (endCount < iters.length) {
    const { index, next } = await Promise.race(promises);
    yield next;

    if (next.done) {
      endCount++;
      promises[index] = never();
      continue;
    }

    promises[index] = new Promise(res => {
      iters[index].next().then(n => {
        res({
          index,
          next: n,
        });
      });
    });
  }
}

async function never() {
  return new Promise(noop);
}

function noop() {}

async function* interval(ms) {
  let i = 0;
  while (true) {
    await sleep(ms);
    yield i++;
  }
}

async function* map(iter, mapFn) {
  let index = 0;
  for await (const item of iter) {
    yield mapFn(item, index++);
  }
}

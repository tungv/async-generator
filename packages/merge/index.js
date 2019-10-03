module.exports = async function* merge(...iters) {
  const promises = iters.map(async (it, index) => ({
    index,
    next: await it.next(),
  }));
  let endCount = 0;

  while (endCount < iters.length) {
    const { index, next } = await Promise.race(promises);
    yield next.value;

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
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function never() {
  return new Promise(noop);
}

function noop() {}

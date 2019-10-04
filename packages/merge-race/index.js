module.exports = async function* merge(...iters) {
  const promises = iters.map(async (it, index) => ({
    index,
    next: await it.next(),
  }));
  let endCount = 0;

  while (endCount < iters.length) {
    const { index, next } = await Promise.race(promises);

    if (next.done) {
      await Promise.all(
        iters.map(async (it, idx) => {
          if (idx !== index) {
            await it.return();
          }
        })
      );

      return;
    }

    yield next.value;
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

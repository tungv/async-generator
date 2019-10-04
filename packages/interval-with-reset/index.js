const identity = x => x;
function defer() {
  let resolve, reject;

  const promise = new Promise((_1, _2) => {
    resolve = _1;
    reject = _2;
  });
  return {
    promise,
    resolve,
    reject,
  };
}

module.exports = function intervalWithReset(ms, mapFn = identity) {
  let $q = defer();
  let timer;
  let counter = 0;

  reset();

  async function* generate() {
    while (await $q.promise) {
      yield mapFn(counter++);
    }
  }

  function reset() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      $q.resolve(true);
      $q = defer();
      reset();
    }, ms);
  }
  return [generate(), reset];
};

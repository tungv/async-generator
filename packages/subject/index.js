module.exports = function createSubject() {
  let $q = defer();
  let aborted = false;

  async function* generate() {
    while (!aborted) {
      const value = await $q.promise;
      yield value;
    }
  }

  function feed(value) {
    $q.resolve(value);
    $q = defer();
  }

  function terminate() {
    aborted = true;
  }

  return [generate(), feed, terminate];
};

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

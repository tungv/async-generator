module.exports = function createSubject(buffer = []) {
  let $q = defer();
  let aborted = false;

  async function* generate() {
    while (!aborted) {
      await $q.promise;
      while (buffer.length) {
        const value = buffer.shift();
        yield value;
      }
    }
  }

  function feed(value) {
    buffer.push(value);
    $q.resolve();
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

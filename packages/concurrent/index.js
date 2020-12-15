const subject = require("@async-generator/subject");

module.exports = async function* concurrent(input$, parallelism, asyncWork) {
  let concurrentWorks = 0;

  const [iter, emit, end] = subject();
  let mutex = newMutex();

  (async function() {
    for await (const input of input$) {
      while (concurrentWorks >= parallelism) {
        await mutex.wait();
      }

      concurrentWorks++;
      asyncWork(input).then(result => {
        if (--concurrentWorks < parallelism) {
          mutex.release();
        }
        emit(result);
      });
    }

    do {
      await mutex.wait();
    } while (concurrentWorks > 0);
    end();
  })();

  for await (let result of iter) {
    yield result;
  }
};

function newMutex() {
  let m = defer();
  return {
    wait() {
      return m.promise;
    },
    release() {
      m.resolve();
      m = defer();
    },
  };
}

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

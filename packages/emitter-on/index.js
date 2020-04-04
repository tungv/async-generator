const subject = require("@async-generator/subject");

module.exports = async function* on(emitter, eventName) {
  const [iterator, feed] = subject();

  function handler(data) {
    feed(data);
  }

  try {
    emitter.on(eventName, handler);
    for await (const data of iterator) {
      yield data;
    }
  } finally {
    emitter.off(eventName, handler);
  }
};

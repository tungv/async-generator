module.exports = async function* take(iter, limit) {
  let i = 0;
  for await (const item of iter) {
    i++;
    if (i <= limit) {
      yield item;
    }

    if (i === limit) {
      break;
    }
  }
};

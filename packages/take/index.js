module.exports = async function* take(iter, limit) {
  let i = 0;
  while (i++ < limit) {
    const next = await iter.next();

    yield next.value;

    if (next.done) {
      break;
    }
  }

  // require upstream generator to cleanup
  iter.return();
};


module.exports = function (err, req, res, next) {
  if (!err) {
    return next();
  }
  console.error(err.stack);
  return res.status(500).render('error', {
    error: err.stack
  });
}
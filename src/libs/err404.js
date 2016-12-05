
module.exports = function (req, res) {
  res.status(404).render('error', {
    url: req.originalUrl,
    error: 'Not Found'
  });
}
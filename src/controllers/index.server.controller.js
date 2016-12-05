exports.index = function(req, res) {
  return res.render('index', {
    title: '首页'
  });
};
var mongoose = require('mongoose');
var _ = require('lodash');
var errorHandler = require('./errors.server.controller');
var User = mongoose.model('User');

exports.index = function(req, res) {
  return res.render('login', {
    title: '登录'
  });
};

exports.postlogin = function(req, res) {

  if ((req.body.username != null) && (req.body.password != null)) {
    return User.findOne({
      username: req.body.username
    }).exec(function(err, result) {
      if (err) {
        return res.json({
          rtn: -1,
          message: "fail"
        });
      }
      console.log(result);
      if (result && result.password === req.body.password) {
        res.cookie('token', result.token, 30);
        res.cookie('name', result.name, 30);
        //res.cookie('type', result.type, 30);
        //res.cookie('authority',result.authority.toString());
	    //res.cookie('departId', result.departId, 30);
        logger.info('用户: ' + req.body.username + ' 登录系统成功');
        return res.json({
          rtn:0,
          message: 'success'
        });
      } else {
        return res.json({
          rtn:-2,
          message: "用户密码不匹配"
        });
      }
    });
  } else {
    return res.json({
      rtn: -3,
      message: "用户名和密码不能为空"
    });
  }
};

exports.logout = function(req, res) {
  res.clearCookie('token');
  res.clearCookie('username');
  //res.clearCookie('type');
  //res.clearCookie('authority');
  //res.clearCookie('departId');
  return res.redirect('/login');
};

var express = require('express')
var user = require('../controllers/user.server.controller');

var app = express.Router()

//app.route('/admin/reset')
//  .put(user.requiresLogin, user.adminReset);

app.route('/user')
  .get(user.requiresLogin, user.index)
  .post(user.requiresLogin, user.newUser);


//app.route('/users')
//  .get(user.requiresLogin, user.getUsers)
//  .delete(user.requiresLogin, user.deleteusers);
//
//app.route('/user/:uid')
//  .get(user.requiresLogin, user.userinfo)
//  .put(user.requiresLogin, user.updateUser)
//  .delete(user.requiresLogin, user.deleteuser);
//
//app.route('/user/:uid/password')
//  .put(user.requiresLogin, user.changePassword);
//
//app.route('/authorize/:uid')
//  .post(user.requiresLogin, user.authorize);
//
//app.route('/getMediaSize')
//  .get(user.getmediaSize);
//
//app.route('/getInitArr')
//  .get(user.getInitState);
//
//app.route('/getPersonInitArr')
//  .post(user.getPersonInitState);
//
//app.route('/user/boxes/:uid')
//  .get(user.requiresLogin, user.getUserBoxes);
//
//app.route('/user/permission/:uid')
//  .post(user.requiresLogin, user.permission);
//
//
//
//app.param('uid', user.userByID);

module.exports = app
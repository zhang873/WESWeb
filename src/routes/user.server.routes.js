var express = require('express')
var user = require('../controllers/user.server.controller');

var app = express.Router()

app.route('/admin/reset')
  .put(user.requiresLogin, user.adminReset);

app.route('/user')
  .get(user.requiresLogin, user.index)

app.route('/wes/users')
    .get(user.requiresLogin, user.array)

app.route('/wes/user')
    .post(user.requiresLogin, user.newUser)
    .put(user.requiresLogin, user.updateUser)
    .delete(user.requiresLogin, user.deleteusers)

app.route('/wes/user/:uid')
  .get(user.requiresLogin, user.userinfo)
//
//  .delete(user.requiresLogin, user.deleteuser)
//
app.route('/wes/user/:uid/password')
  .put(user.requiresLogin, user.changePassword)

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
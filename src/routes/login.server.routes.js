var express = require('express')
var index = require('../controllers/index.server.controller')
//var log = require('../controllers/log.server.controller')
//var user = require('../controllers/user.server.controller')
var login = require('../controllers/login.server.controller')

var app = express.Router()

app.route('/login')
  .get(login.index)
  .post(login.postlogin)

app.route('/logout')
  .get(login.logout)

module.exports = app
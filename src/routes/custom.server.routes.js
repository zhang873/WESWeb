/**
 * Created by xc.zhang on 2016/11/21.
 */
var express = require('express')
var custom = require('../controllers/custom.server.controller')
var user = require('../controllers/user.server.controller')

var app = express.Router()

app.route('/custom')
    .get(user.requiresLogin, custom.index)

app.route('/wes/customs')
    .get(user.requiresLogin, custom.array)

app.route('/wes/custom')
    .get(user.requiresLogin, custom.list)
    .post(user.requiresLogin, custom.add)
    .delete(user.requiresLogin, custom.delete)
    .put(user.requiresLogin, custom.modify)

module.exports = app
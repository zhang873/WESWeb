/**
 * Created by xc.zhang on 2016/11/23.
 */
var express = require('express')
var statistics = require('../controllers/statistics.server.controller')
var user = require('../controllers/user.server.controller')

var app = express.Router()

app.route('/statistics')
    .get(user.requiresLogin, statistics.index)


module.exports = app
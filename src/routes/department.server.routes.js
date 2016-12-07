/**
 * Created by xc.zhang on 2016/11/29.
 */
var express = require('express')
var department = require('../controllers/department.server.controller')
var user = require('../controllers/user.server.controller')

var app = express.Router()

app.route('/department')
    .get(user.requiresLogin, department.index)

app.route('/wes/departments')
    .get(user.requiresLogin, department.array)

app.route('/wes/department')
    .get(user.requiresLogin, department.list)
    .post(user.requiresLogin, department.add)
    .delete(user.requiresLogin, department.delete)
    .put(user.requiresLogin, department.modify)

module.exports = app
/**
 * Created by xc.zhang on 2016/11/29.
 */
var express = require('express')
var department = require('../controllers/department.server.controller')

var app = express.Router()

app.route('/department')
    .get(department.index)

app.route('/wes/departments')
    .get(department.array)

app.route('/wes/department')
    .get(department.list)
    .post(department.add)
    .delete(department.delete)


module.exports = app
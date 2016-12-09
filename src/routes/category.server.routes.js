/**
 * Created by xc.zhang on 2016/12/7.
 */
var express = require('express')
var category = require('../controllers/category.server.controller')
var user = require('../controllers/user.server.controller')

var app = express.Router()

app.route('/category')
    .get(user.requiresLogin, category.index)

app.route('/wes/categorys')
    .get(user.requiresLogin, category.array)

app.route('/wes/category')
    .get(user.requiresLogin, category.list)
    .post(user.requiresLogin, category.add)
    .delete(user.requiresLogin, category.delete)
    .put(user.requiresLogin, category.modify)

module.exports = app
/**
 * Created by xc.zhang on 2016/11/21.
 */
var express = require('express')
var product = require('../controllers/product.server.controller')
var user = require('../controllers/user.server.controller')

var app = express.Router()

app.route('/product')
    .get(user.requiresLogin, product.index)

app.route('/wes/products')
    .get(user.requiresLogin, product.array)

app.route('/wes/product')
    .get(user.requiresLogin, product.list)
    .post(user.requiresLogin, product.add)
    .delete(user.requiresLogin, product.delete)
    .put(user.requiresLogin, product.modify)

module.exports = app
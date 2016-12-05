/**
 * Created by xc.zhang on 2016/11/21.
 */
var express = require('express')
var product = require('../controllers/product.server.controller')

var app = express.Router()

app.route('/wes/product')
    .get(product.list)
    .post(product.add)
    .delete(product.delete)

app.route('/product')
    .get(product.index)

module.exports = app
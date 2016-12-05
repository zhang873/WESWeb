/**
 * Created by xc.zhang on 2016/11/22.
 */
var express = require('express')
var sales = require('../controllers/purchase.server.controller')

var app = express.Router()

app.route('/wes/purchase')
    .get(purchase.list)
    .post(purchase.add)
    .delete(purchase.delete)

app.route('/purchase')
    .get(purchase.index)

module.exports = app
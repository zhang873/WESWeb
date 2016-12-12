/**
 * Created by xc.zhang on 2016/11/21.
 */
var express = require('express')
var sales = require('../controllers/sales.server.controller')

var app = express.Router()

app.route('/wes/sales')
    .get(sales.list)
    .post(sales.add)
    .put(sales.modify)
    .delete(sales.delete)

app.route('/sales')
    .get(sales.index)

module.exports = app
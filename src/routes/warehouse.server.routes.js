/**
 * Created by xc.zhang on 2016/11/21.
 */
var express = require('express')
var warehouse = require('../controllers/warehouse.server.controller')

var app = express.Router()

app.route('/wes/warehouse')
    .get(warehouse.list)
    .post(warehouse.add)
    .delete(warehouse.delete)

app.route('/warehouse')
    .get(warehouse.index)

module.exports = app
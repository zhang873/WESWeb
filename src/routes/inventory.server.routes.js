/**
 * Created by xc.zhang on 2016/11/21.
 */
var express = require('express')
var inventory = require('../controllers/inventory.server.controller')

var app = express.Router()

app.route('/wes/inventory')
    .get(inventory.list)
    .post(inventory.add)
    .delete(inventory.delete)

app.route('/inventory')
    .get(inventory.index)

module.exports = app
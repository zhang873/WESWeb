/**
 * Created by xc.zhang on 2016/11/21.
 */
var express = require('express')
var logistics = require('../controllers/logistics.server.controller')

var app = express.Router()

app.route('/wes/logistics')
    .get(logistics.list)
    .post(logistics.add)
    .delete(logistics.delete)

app.route('/logistics')
    .get(logistics.index)

module.exports = app
/**
 * Created by xc.zhang on 2016/11/21.
 */
var express = require('express')
var custom = require('../controllers/custom.server.controller')

var app = express.Router()

app.route('/custom')
    .get(custom.index)

app.route('/wes/customs')
    .get(custom.array)

app.route('/wes/custom')
    .get(custom.list)
    .post(custom.add)
    .delete(custom.delete)
    .put(custom.modify)

module.exports = app
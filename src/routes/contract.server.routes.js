/**
 * Created by xc.zhang on 2016/11/23.
 */
var express = require('express')
var contract = require('../controllers/contract.server.controller')

var app = express.Router()

app.route('/contract')
    .get(contract.index)

app.route('/contract/create')
    .get(contract.showEdit)

app.route('/contract/edit')
    .get(contract.showEdit);

app.route('/wes/contracts')
    .get(contract.list)

module.exports = app
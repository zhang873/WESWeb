/**
 * Created by xc.zhang on 2016/11/23.
 */
var express = require('express')
var contract = require('../controllers/contract.server.controller')
var user = require('../controllers/user.server.controller')

var app = express.Router()

app.route('/contract')
    .get(user.requiresLogin, contract.index)

app.route('/contract/create')
    .get(user.requiresLogin, contract.showEdit)

app.route('/contract/edit')
    .get(user.requiresLogin, contract.showEdit);

app.route('/contract/:contractid')
    .get(user.requiresLogin, contract.getContract);

app.route('/wes/contracts')
    .get(user.requiresLogin, contract.array)

app.route('/wes/contract')
    .get(user.requiresLogin, contract.list)
    .post(user.requiresLogin, contract.add)
    .delete(user.requiresLogin, contract.delete)
    .put(user.requiresLogin, contract.modify)

module.exports = app
var express = require('express')
var index = require('../controllers/index.server.controller')
var user = require('../controllers/user.server.controller')

var app = module.exports = express.Router()

app.route('/')
    .get(user.requiresLogin, index.index)

app.route('/index')
    .get(user.requiresLogin, index.index)

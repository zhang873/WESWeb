var mongoose = require('mongoose');
var _ = require('lodash');
var errorHandler = require('./errors.server.controller');

exports.index = function(req, res) {
  return res.render('404', {
    title: '404'
  });
};
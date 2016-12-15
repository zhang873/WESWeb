/**
 * Created by xc.zhang on 2016/11/23.
 */

var _ = require('lodash')
var async = require('async')
var mongoose = require('mongoose')
var Sales = mongoose.model('Sales')

exports.index = function(req, res) {
    return res.render('statistics', {
        title: '统计'
    });
};

/**
 * Created by xc.zhang on 2016/11/23.
 */

var _ = require('lodash')
var async = require('async')
var mongoose = require('mongoose')
var Sales = mongoose.model('Sales')

exports.index = function(req, res) {
    return res.render('contract/index', {
        title: '首页'
    });
};

exports.showEdit = function(req, res) {
    res.render('contract/edit', {
        title: '编辑'
    })
}

exports.list = function(req, res) {

    var contracts = [];

    Sales.find({
        is_delete : 0
    }).exec(function(err, sales) {

        if (err) {
            return res.json({
                rtn: -1,
                message:'fail'
            });
        }

        var contracts = _.map(sales, function(each) {
            console.log("##################")
            console.log(each)
            return each
        })
        res.json(contracts)

        //async.each(sales, function(each, callback) {
        //    contracts.push(each.getAllAttr());
        //    return callback(null);
        //}, function(err) {
        //        if (err) {
        //            return res.json({
        //                rtn: -1,
        //                message: err
        //            })
        //        }
        //        return res.json(contracts);
        //    }
        //)

        //return res.json({
        //    rtn: 0,
        //    message:'success',
        //    sales : sales
        //});
    })
};
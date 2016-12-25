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

exports.calculate = function(req, res) {
    var limit = {};

    //console.log(req.body);

    limit.is_delete = 0;
    //limit.date = {"$gte": ISODate(req.body.start_date)};

    if (req.body.startDate && !req.body.endDate) {
        limit.date = {"$gte": new Date(req.body.startDate)};
    }
    if (!req.body.startDate && req.body.endDate) {
        limit.date = {"$lte": new Date(req.body.endDate)};
    }
    if (req.body.startDate && req.body.endDate) {
        limit.date = {"$gte": new Date(req.body.startDate), "$lte": new Date(req.body.endDate)};
    }
    if (req.body.customs) {
        limit.custom = {$in: req.body.customs};
    }

    if (req.body.users) {
        limit.seller = {$in: req.body.users};
    }
    //limit.custom = {$in :req.body.customs};

    console.log(limit);

    Sales.find(limit).exec(function(err, sales) {

        if (err) {
            console.log(err)
            return res.json({
                rtn: -1,
                message:'fail'
            });
        }
        //console.log(sales);

        var total = 0, profit = 0, balance = 0;
        var products = [];
        async.each(sales, function(s, callback) {
            total += parseFloat(s.total);
            profit += parseFloat(s.profit);
            balance += parseFloat(s.balance);

            products.push(s.product);
        });

        return res.json({
            rtn: 0,
            message:'success',
            sales : sales,
            total : total,
            profit : profit,
            balance : balance,
            products : products
        });
    })
};

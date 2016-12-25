/**
 * Created by xc.zhang on 2016/11/21.
 */

var async = require('async')
var mongoose = require('mongoose')
var Sales = mongoose.model('Sales')

exports.index = function(req, res) {
    return res.render('login', {
        title: '��¼'
    });
};

exports.list = function(req, res) {
    Sales.find({
        is_delete : 0
    }).exec(function(err, sales) {

        if (err) {
            return res.json({
                rtn: -1,
                message:'fail'
            });
        }

        return res.json({
            rtn: 0,
            message:'success',
            sales : sales
        });
    })
};

exports.add = function(req, res) {
    Sales.findOne({
        contract_no:req.body.contract_no,
        is_delete : 0
    }).exec(function(err, sales) {
        if (err) {
            return res.json({
                rtn: -1,
                message:'fail'
            });
        }

        if (sales) {
            return res.json({
                rtn: -2,
                message:'�Ѵ���'
            });
        }

        //var info = {};
        //info.contract_no = req.body.contract_no;
        //info.date = new Date(req.body.date);
        //info.seller = req.body.seller;
        //info.custom = req.body.custom;
        //info.product = req.body.product;
        //info.payment_provision = req.body.payment_provision;
        //info.marks = req.body.marks;
        Sales.create(req.body, function(err) {
            if (err) {
                return res.json({
                    rtn: -3,
                    message:'fail'
                });
            }

            return res.json({
                rtn: 0,
                message:'success'
            });
        });
    })
};

exports.modify = function(req, res) {

    Sales.update({_id:req.body._id},{$set:req.body},function(err){
        if(err){
            console.log(err);
        }
        return res.json({
            rtn: 0,
            message:'success'
        });
    })

};

exports.delete = function(req, res) {

    Sales.update({_id:req.body._id},{$set:{is_delete:1}},function(err){
        if(err){
            console.log(err);
        }
        return res.json({
            rtn: 0,
            message:'success'
        });
    })

};
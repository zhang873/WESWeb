/**
 * Created by xc.zhang on 2016/11/21.
 */

var mongoose = require('mongoose')
var Product = mongoose.model('Product')

exports.index = function(req, res) {
    return res.render('login', {
        title: 'µÇÂ¼'
    });
};

exports.list = function(req, res) {
    Product.find({
        is_delete : 0
    }).exec(function(err, product) {

        if (err) {
            return res.json({
                rtn: -1,
                message:'fail'
            });
        }

        return res.json({
            rtn: 0,
            message:'success',
            product : product
        });
    })
};

exports.add = function(req, res) {
    Product.findOne({
        name:req.body.name,
        model:req.body.model,
        is_delete : 0
    }).exec(function(err, product) {
        if (err) {
            return res.json({
                rtn: -1,
                message:'fail'
            });
        }

        if (product) {
            return res.json({
                rtn: -2,
                message:'ÒÑ´æÔÚ'
            });
        }

        var info = {};
        info.name = req.body.name;
        info.model = req.body.model;
        info.currency = req.body.currency;
        info.cost = req.body.cost
        info.marks = req.body.marks;
        Product.create(info, function(err) {
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

exports.delete = function(req, res) {

    Product.update({_id:req.body._id},{$set:{is_delete:1}},function(err){
        if(err){
            console.log(err);
        }
        return res.json({
            rtn: 0,
            message:'success'
        });
    })

};
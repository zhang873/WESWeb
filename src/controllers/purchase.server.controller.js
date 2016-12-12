/**
 * Created by xc.zhang on 2016/11/22.
 */

var mongoose = require('mongoose')
var Purchase = mongoose.model('Purchase')

exports.index = function(req, res) {
    return res.render('login', {
        title: 'µÇÂ¼'
    });
};

exports.list = function(req, res) {
    Purchase.find({
        is_delete : 0
    }).exec(function(err, purchase) {

        if (err) {
            return res.json({
                rtn: -1,
                message:'fail'
            });
        }

        return res.json({
            rtn: 0,
            message:'success',
            purchase : purchase
        });
    })
};

exports.add = function(req, res) {
    //Purchase.findOne({
    //    is_delete : 0
    //}).exec(function(err, sales) {
    //    if (err) {
    //        return res.json({
    //            rtn: -1,
    //            message:'fail'
    //        });
    //    }
    //
    //    if (sales) {
    //        return res.json({
    //            rtn: -2,
    //            message:'ÒÑ´æÔÚ'
    //        });
    //    }

    Purchase.create(req.body, function(err) {
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
    //})
};

exports.delete = function(req, res) {

    Purchase.update({_id:req.body._id},{$set:{is_delete:1}},function(err){
        if(err){
            console.log(err);
        }
        return res.json({
            rtn: 0,
            message:'success'
        });
    })

};
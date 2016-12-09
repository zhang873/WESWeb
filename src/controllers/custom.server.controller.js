/**
 * Created by xc.zhang on 2016/11/21.
 */

var _ = require('lodash')
var async = require('async')
var mongoose = require('mongoose')
var Custom = mongoose.model('Custom')

exports.index = function(req, res) {
    return res.render('custom', {
        title: '客户'
    });
};

exports.array = function(req, res) {

    //var customs = [];

    Custom.find({
        is_delete : 0
    }).exec(function(err, custom) {

        if (err) {
            return res.json({
                rtn: -1,
                message:'fail'
            });
        }

        var customs = _.map(custom, function(each) {
            return each
        })
        res.json(customs)

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

exports.list = function(req, res) {
    Custom.find({
        is_delete : 0
    }).exec(function(err, custom) {

        if (err) {
            return res.json({
                rtn: -1,
                message:'fail'
            });
        }

        //async.each(custom, function(c, cb) {
        //    var item = {};
        //    info.custom.push(c);
        //})

        return res.json({
            rtn: 0,
            message:'success',
            custom : custom
        });
    })
};

exports.add = function(req, res) {
    Custom.findOne({
        name:req.body.name,
        is_delete : 0
    }).exec(function(err, custom) {
        if (err) {
            return res.json({
                rtn: -1,
                message:'fail'
            });
        }

        if (custom) {
            return res.json({
                rtn: -2,
                message:'已存在'
            });
        }

        var info = {};
        info.name = req.body.name;
        info.description = req.body.description;
        info.is_delete = 0;
        info.create_at = '';
        info.update_at = '';
        Custom.create(info, function(err, c) {
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

    console.log(req.body);
    Custom.update({_id:req.body._id},{$set:req.body},function(err){
        if(err){
            console.log(err);
            return res.json({
                rtn: -1,
                message:err
            });
        }
        return res.json({
            rtn: 0,
            message:'success'
        });
    })
};

exports.delete = function(req, res) {
    async.each(req.body, function(Id, callback){
        Custom.update({_id:Id},{$set:{is_delete:1}},function(err){
            if(err){
                console.log(err);
                return callback(err)
            }
        })
        callback(null)
    }, function(err){
        if (err) {
            logger.info('用户: ' + req.cookies.name + ' 删除多条播放列表 ' + req.body + '失败');
            return res.json({
                rtn: -1,
                message:'fail'
            });
        } else {
            logger.info('用户: ' + req.cookies.name + ' 删除多条播放列表 ' + req.body + '成功');
            return res.json({
                rtn: 0,
                message:'success'
            });
        }

    });

};
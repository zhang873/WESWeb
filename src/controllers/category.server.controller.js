/**
 * Created by xc.zhang on 2016/12/7.
 */

var _ = require('lodash')
var async = require('async')
var mongoose = require('mongoose')
var Category = mongoose.model('Category')

exports.index = function(req, res) {
    return res.render('category', {
        title: '类别'
    });
};

exports.array = function(req, res) {

    //var ctegorys = [];
    Category.find({
        is_delete : 0
    }).exec(function(err, ctegory) {

        if (err) {
            return res.json({
                rtn: -1,
                message:'fail'
            });
        }

        var ctegorys = _.map(ctegory, function(each) {
            return each
        })
        res.json(ctegorys)

    })
};

exports.list = function(req, res) {
    Category.find({
        is_delete : 0
    }).exec(function(err, ctegory) {

        if (err) {
            return res.json({
                rtn: -1,
                message:'fail'
            });
        }

        return res.json({
            rtn: 0,
            message:'success',
            ctegory : ctegory
        });
    })
};

exports.add = function(req, res) {
    Category.findOne({
        name:req.body.name,
        is_delete : 0
    }).exec(function(err, ctegory) {
        if (err) {
            return res.json({
                rtn: -1,
                message:'fail'
            });
        }

        if (ctegory) {
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
        Category.create(info, function(err, c) {
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
    Category.update({_id:req.body._id},{$set:req.body},function(err){
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
        Category.update({_id:Id},{$set:{is_delete:1}},function(err){
            if(err){
                console.log(err);
                return callback(err)
            }
        })
        callback(null)
    }, function(err){
        if (err) {
            logger.info('用户: ' + req.cookies.name + ' 删除多条类别 ' + req.body + '失败');
            return res.json({
                rtn: -1,
                message:'fail'
            });
        } else {
            logger.info('用户: ' + req.cookies.name + ' 删除多条类别 ' + req.body + '成功');
            return res.json({
                rtn: 0,
                message:'success'
            });
        }

    });

};
/**
 * Created by xc.zhang on 2016/11/29.
 */

var _ = require('lodash')
var async = require('async')
var mongoose = require('mongoose')
var Department = mongoose.model('Department')

exports.index = function(req, res) {
    return res.render('department', {
        title: '部门'
    });
};

exports.array = function(req, res) {

    var departments = [];

    Department.find({
        is_delete : 0
    }).exec(function(err, department) {

        if (err) {
            return res.json({
                rtn: -1,
                message:'fail'
            });
        }

        var departments = _.map(department, function(each) {
            return each
        })
        res.json(departments)

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
    Department.find({
        is_delete : 0
    }).exec(function(err, department) {

        if (err) {
            return res.json({
                rtn: -1,
                message:'fail'
            });
        }

        return res.json({
            rtn: 0,
            message:'success',
            department : department
        });
    })
};

exports.add = function(req, res) {

    if (!req.body.name || !req.body.description) {
        return res.json({
            rtn: -4,
            message:'信息不全'
        });
    }

    Department.findOne({
        name:req.body.name,
        is_delete : 0
    }).exec(function(err, department) {
        if (err) {
            return res.json({
                rtn: -1,
                message:'fail'
            });
        }

        if (department) {
            return res.json({
                rtn: -2,
                message:'已存在'
            });
        }
        console.log("#####################1");

        var info = {};
        info.name = req.body.name;
        info.description = req.body.description;
        info.is_delete = 0;
        info.create_at = '';
        info.update_at = '';
        Department.create(info, function(err, d) {
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
    Department.update({_id:req.body._id},{$set:req.body},function(err){
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
        Department.update({_id:Id},{$set:{is_delete:1}},function(err){
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
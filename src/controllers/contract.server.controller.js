/**
 * Created by xc.zhang on 2016/11/23.
 */

var _ = require('lodash')
var async = require('async')
var mongoose = require('mongoose')
var Sales = mongoose.model('Sales')

exports.index = function(req, res) {
    return res.render('contract/index', {
        title: '合同'
    });
};

exports.showEdit = function(req, res) {
    res.render('contract/edit', {
        id: String(req.query.id),
        title: '编辑'
    })
}

exports.getContract = function(req, res) {

    Sales.findOne({
        _id : req.params.contractid,
        is_delete : 0
    }).exec(function(err, sale) {

        if (err) {
            return res.json({
                rtn: -1,
                message:'fail'
            });
        }

        return res.json(sale);
    })
}

exports.array = function(req, res) {

    //var ctegorys = [];
    Sales.find({
        is_delete : 0
    }).exec(function(err, sale) {

        if (err) {
            return res.json({
                rtn: -1,
                message:'fail'
            });
        }

        var sales = _.map(sale, function(each) {
            return each
        })
        res.json(sales)

    })
};

exports.list = function(req, res) {
    Sales.find({
        is_delete : 0
    }).exec(function(err, sale) {

        if (err) {
            return res.json({
                rtn: -1,
                message:'fail'
            });
        }

        return res.json({
            rtn: 0,
            message:'success',
            sale : sale
        });
    })
};

exports.add = function(req, res) {
    Sales.findOne({
        contract_no:req.body.contract_no,
        is_delete : 0
    }).exec(function(err, sale) {
        if (err) {
            return res.json({
                rtn: -1,
                message:'fail'
            });
        }

        if (sale) {
            return res.json({
                rtn: -2,
                message:'已存在'
            });
        }

        Sales.create(req.body, function(err, c) {
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

    Contract.update({_id:req.body._id},{$set:req.body},function(err){
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
        Sales.update({_id:Id},{$set:{is_delete:1}},function(err){
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

//exports.list = function(req, res) {
//
//    var contracts = [];
//
//    Sales.find({
//        is_delete : 0
//    }).exec(function(err, sales) {
//
//        if (err) {
//            return res.json({
//                rtn: -1,
//                message:'fail'
//            });
//        }
//
//        var contracts = _.map(sales, function(each) {
//            console.log("##################")
//            console.log(each)
//            return each
//        })
//        res.json(contracts)
//
//        //async.each(sales, function(each, callback) {
//        //    contracts.push(each.getAllAttr());
//        //    return callback(null);
//        //}, function(err) {
//        //        if (err) {
//        //            return res.json({
//        //                rtn: -1,
//        //                message: err
//        //            })
//        //        }
//        //        return res.json(contracts);
//        //    }
//        //)
//
//        //return res.json({
//        //    rtn: 0,
//        //    message:'success',
//        //    sales : sales
//        //});
//    })
//};
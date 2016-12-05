/**
 * Created by xc.zhang on 2016/11/21.
 */

var mongoose = require('mongoose')
var Warehouse = mongoose.model('Warehouse')

exports.index = function(req, res) {
    return res.render('login', {
        title: 'µÇÂ¼'
    });
};

exports.list = function(req, res) {
    Warehouse.find({
        is_delete : 0
    }).exec(function(err, warehouse) {

        if (err) {
            return res.json({
                rtn: -1,
                message:'fail'
            });
        }

        return res.json({
            rtn: 0,
            message:'success',
            warehouse : warehouse
        });
    })
};

exports.add = function(req, res) {
    Warehouse.findOne({
        name:req.body.name,
        is_delete : 0
    }).exec(function(err, warehouse) {
        if (err) {
            return res.json({
                rtn: -1,
                message:'fail'
            });
        }

        if (warehouse) {
            return res.json({
                rtn: -2,
                message:'ÒÑ´æÔÚ'
            });
        }

        var info = {};
        info.name = req.body.name;
        info.physical = req.body.physical;
        info.description = req.body.description;
        info.marks = req.body.marks;
        Warehouse.create(info, function(err) {
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

    Warehouse.update({_id:req.body._id},{$set:{is_delete:1}},function(err){
        if(err){
            console.log(err);
        }
        return res.json({
            rtn: 0,
            message:'success'
        });
    })

};
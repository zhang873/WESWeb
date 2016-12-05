/**
 * Created by xc.zhang on 2016/11/21.
 */

var mongoose = require('mongoose')
var Logistics = mongoose.model('Logistics')

exports.index = function(req, res) {
    return res.render('login', {
        title: 'µÇÂ¼'
    });
};

exports.list = function(req, res) {
    Logistics.find({
        is_delete : 0
    }).exec(function(err, logistics) {

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
            logistics : logistics
        });
    })
};

exports.add = function(req, res) {
    Logistics.findOne({
        name:req.body.name,
        is_delete : 0
    }).exec(function(err, logistics) {
        if (err) {
            return res.json({
                rtn: -1,
                message:'fail'
            });
        }

        if (logistics) {
            return res.json({
                rtn: -2,
                message:'ÒÑ´æÔÚ'
            });
        }

        var info = {};
        info.name = req.body.name;
        info.description = req.body.description;
        info.mark = req.body.mark;
        Logistics.create(info, function(err) {
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

    Logistics.update({_id:req.body._id},{$set:{is_delete:1}},function(err){
        if(err){
            console.log(err);
        }
        return res.json({
            rtn: 0,
            message:'success'
        });
    })

};
/**
 * Created by xc.zhang on 2016/11/21.
 */
var mongoose = require('mongoose')
var Inventory = mongoose.model('Inventory')

exports.index = function(req, res) {
    return res.render('login', {
        title: 'µÇÂ¼'
    });
};

exports.list = function(req, res) {
    Inventory.find({
        is_delete : 0
    }).exec(function(err, inventory) {

        if (err) {
            return res.json({
                rtn: -1,
                message:'fail'
            });
        }
        return res.json({
            rtn: 0,
            message:'success',
            inventory : inventory
        });
    })
};

exports.add = function(req, res) {
    var inventory = {};
    inventory.warehouse = req.body.warehouse;
    inventory.product = req.body.product;
    inventory.number = req.body.number;
    inventory.unit_price = req.body.unit_price;
    inventory.logistics = req.body.logistics;
    inventory.inout = req.body.inout;
    inventory.inout_type = req.body.inout_type;
    inventory.contract = req.body.contract;
    inventory.operator = req.body.operator;
    inventory.marks = req.body.marks;

    Inventory.create(info, function(err, i) {
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

    Inventory.update({_id:req.body._id},{$set:{is_delete:1}},function(err){
        if(err){
            console.log(err);
        }
        return res.json({
            rtn: 0,
            message:'success'
        });
    })

};
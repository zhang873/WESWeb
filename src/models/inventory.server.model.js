/**
 * Created by xc.zhang on 2016/11/21.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');

var InventorySchema = new Schema({

    warehouse: {
        type:String,
        "default":''
    },
    product: {
        type:String,
        "default":''
    },
    number: {
        type:Number,
        "default":0
    },
    unit_price:  {
        type:String,
        "default":''
    },
    logistics: {
        type:String,
        "default":''
    },
    inout: {
        type:Number,
        "default":0
    },
    inout_type:  {
        type:Number,
        "default":0
    },
    contract: {
        type:String,
        "default":''
    },
    operator: {
        type:String,
        "default":''
    },
    marks: {
        type:String,
        "default":''
    },
    is_delete:{
        type:Number,
        "default":0
    },
    create_at:{
        type:String,
        "default":''
    },
    update_at:{
        type:String,
        "default":''
    }
});

mongoose.model('Inventory', InventorySchema);
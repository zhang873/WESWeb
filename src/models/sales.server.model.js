/**
 * Created by xc.zhang on 2016/11/21.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');

var SalesSchema = new Schema({

    contract_no: {
        type:String,
        "default":''
    },
    date: {
        type:String,
        "default":''
    },
    sellser: {
        type:String,
        "default":''
    },
    custom:  {
        type:String,
        "default":''
    },
    product: {
        type:Array,
        "default":[]
    },

    total: {
        type:String,
        "default":''
    },
    payment_provision: {
        type:String,
        "default":''
    },
    marks: {
        type:String,
        "default":''
    },
    status:  {
        type:Number,
        "default":0
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

mongoose.model('Sales', SalesSchema);
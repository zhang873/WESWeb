/**
 * Created by xc.zhang on 2016/11/22.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');

var PurchaseSchema = new Schema({

    contract_no: {
        type:String,
        "default":''
    },
    date: {
        type:String,
        "default":''
    },
    user: {
        type:String,
        "default":''
    },
    supplier:  {
        type:String,
        "default":''
    },
    product: {
        type:Array,
        "default":[]
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

mongoose.model('Purchase', PurchaseSchema);
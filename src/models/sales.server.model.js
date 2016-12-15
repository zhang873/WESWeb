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
    seller: {
        type:String,
        "default":''
    },
    custom:  {
        type:String,
        "default":''
    },
    currency: {
        type:String,
        "default":'CNY'
    },
    total: {
        type:String,
        "default":''
    },
    payment_provision: {
        type:String,
        "default":''
    },
    product: {
        type:Array,
        "default":[]
    },
    logistics: {
        type:Array,
        "default":[]
    },
    invoice: {
        type:Array,
        "default":[]
    },
    payment: {
        type:Array,
        "default":[]
    },
    total_cost: {
        type:String,
        "default":''
    },
    total_received: {
        type:String,
        "default":''
    },
    balance: {
        type:String,
        "default":''
    },
    profit: {
        type:String,
        "default":''
    },
    deadline: {
        type:String,
        "default":''
    },
    status:  {
        type:Number,
        "default":0//0：已签订，1：已收货，2：已完毕
    },
    belong: {
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

mongoose.model('Sales', SalesSchema);
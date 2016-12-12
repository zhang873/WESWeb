/**
 * Created by xc.zhang on 2016/11/22.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');

var PurchaseSchema = new Schema({

    sales: {//id
        type:String,
        "default":''
    },
    date: {
        type:String,
        "default":''
    },
    product: {//id
        type:String,
        "default":''
    },
    number:{
        type:String,
        "default":''
    },
    real_price:{
        type:String,
        "default":''
    },
    tariff_rate:{
        type:String,
        "default":''
    },
    tariff:{
        type:String,
        "default":''
    },
    tariff_sum:{
        type:String,
        "default":''
    },
    tariff_price:{
        type:String,
        "default":''
    },
    saletax_rate:{
        type:String,
        "default":''
    },
    saletax:{
        type:String,
        "default":''
    },
    saletax_sum:{
        type:String,
        "default":''
    },
    vat_rate:{
        type:String,
        "default":''
    },
    vat:{
        type:String,
        "default":''
    },
    vat_sum:{
        type:String,
        "default":''
    },
    logis_cost:{
        type:String,
        "default":''
    },
    cost:{
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

mongoose.model('Purchase', PurchaseSchema);
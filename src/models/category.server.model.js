/**
 * Created by xc.zhang on 2016/12/7.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');

var CategorySchema = new Schema({

    name: {
        type:String,
        "default":''
    },
    description:  {
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

mongoose.model('Category', CategorySchema);

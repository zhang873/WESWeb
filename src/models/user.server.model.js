var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');

var UserSchema = new Schema({

  username: {
    type: String ,
    "default": ''
  },
  password: {
    type: String,
    "default":''
  },
  name: {
    type: String,
    "default":''
  },
  //role: String,
  token: {
    type: String,
    "default": ''
  },
  //activated: {
  //  type: Boolean,
  //  "default": false
  //},
  phone: {
    type: String,
    "default": ''
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

UserSchema.statics.getCurrentUserName = function(token) {
  return this.model('User').findOne({
    token: token
  }).exec(function(err, user) {
    if (err != null) {
      return '';
    }
    if (user != null) {
      return user.username;
    }
    return '';
  });
};

mongoose.model('User', UserSchema);


var mongoose = require('mongoose')
var _ = require('lodash')
var express = require('express')
var errorHandler = require('./errors.server.controller')
var User = mongoose.model('User')
var crypto = require('crypto')
var async = require('async')
//var logger = require('../models/logger.server.model')
//var BoxUnionUser = mongoose.model('BoxUnionUser')
//var MediaUnionUser = mongoose.model('MediaUnionUser')
//var PlaylistUnionUser = mongoose.model('PlaylistUnionUser')
//var ScheduleUnionUser = mongoose.model('ScheduleUnionUser')
//var TaskUnionUser = mongoose.model('TaskUnionUser');
//var Setting = mongoose.model('Setting');

function sha1(tobeHash) {
  return crypto.createHash('sha1').update(tobeHash).digest('hex');
}

function md5(tobeHash) {
  return crypto.createHash('md5').update(tobeHash).digest('hex');
}

exports.userByID = function(req, res, next, uid) {
  return User.findById(Object(uid)).exec(function(err, user) {
    if (err) {
      return res.status(500).send({
        status: "fail"
      });
    }
    if (user == null) {
      return res.status(404).send({
        message: "user not fould"
      });
    }
    req.user = user;
    return next();
  });
};

//exports.getUserBoxes = function(req, res) {
//  return BoxUnionUser.find({
//    userId: req.user.id,
//    look:1
//  }).exec(function(err, boxUnionUsers) {
//    return res.json(boxUnionUsers || []);
//  });
//};


exports.requiresLogin = function(req, res, next) {

  var token;
  if (req.cookies.token == null) {
    return res.redirect('/login');
  }
  token = req.cookies.token;
  return User.findOne({
    is_delete:0,
    token: token
  }).exec(function(err, user) {
    if (err) {
      return res.status(500).send({
        status: "fail"
      });
    }
    if (!((user != null) && user.token === token)) {
      return res.redirect('/login');
    }
    req.currentUser = user;
    return next();
  });
};

exports.index = function(req, res) {
  //var authority;
  //authority = {};
  //_.each(req.currentUser.authority, function(auth) {
  //  return authority[auth] = true;
  //});
  res.render('user', {
    user: req.user || null,
    request: req,
    title: '用户',
    //authority: authority
  })
};

exports.adminReset = function(req, res) {
  User.findOneAndUpdate({username: 'admin'}, {
    is_delete:0,
    password: md5('admin'),
    name:'管理员'
  }, function(err, admin) {
    if (err) {
      return res.json({
        status: "fail",
        result: "未知错误"
      });
    }
    res.json(admin)
  })
}

exports.newUser = function(req, res) {
  return User.findOne({
    is_delete:0,
    username: req.body.username
  }).exec(function(err, user) {
    if (err) {
      return res.json({
        status: "fail"
      });
    }
    if (user != null) {
      return res.status(409).json({
        status: "fail",
        msg: "用户已存在"
      });
    }
    User.create(req.body, function(err, user) {
      if (err) {
        return res.status(500).send({
          status: "fail"
        });
      }
     logger.info('用户: ' + req.cookies.username + ' 添加用户 ' + req.body.username + ' 成功')
      //user.id = user._id.toString();
      //user.departId = user._id.toString();
      user.token = user._id.toString();
      return user.save(function(err) {
        if (err) {
          return res.status(500).send({
            status: "fail"
          });
        }
        return res.json(user);
      });
    });
  });
};

//exports.deleteuser = function(req, res) {
//  var user;
//  user = req.user;
//  return user.remove(function(err) {
//    if (err) {
//      return res.send({
//        rtn: -1,
//        message:"fail"
//      });
//    }
//   // BoxUnionUser.remove({userId:user.id},function(err){
//   //   if(err){
//   //     console.log(err);
//   //   }
//   // })
//   // MediaUnionUser.remove({departId:user.departId},function(err){
//   //   if(err){
//   //     console.log(err);
//   //   }
//   // })
//   // PlaylistUnionUser.remove({departId:user.departId},function(err){
//   //   if(err){
//   //     console.log(err);
//   //   }
//   // })
//   //ScheduleUnionUser.remove({departId:user.departId},function(err){
//   //   if(err){
//   //     console.log(err);
//   //   }
//   // })
//   // TaskUnionUser.remove({departId:user.departId},function(err){
//   //   if(err){
//   //     console.log(err);
//   //   }
//   // })
//    logger.info('用户: ' + req.cookies.username + ' 删除用户 ' + req.user.username + ' 成功')
//
//    return res.json({
//      rtn: 0,
//      message:"success"
//    });
//  });
//};

exports.deleteusers = function(req, res) {
  async.each(req.body, function (Id, callback) {
    User.update({_id: Id}, {$set: {is_delete: 1}}, function (err) {
      if (err) {
        console.log(err);
        return callback(err)
      }
    })
    callback(null)
  }, function (err) {
    if (err) {
      logger.info('用户: ' + req.cookies.name + ' 删除多条播放列表 ' + req.body + '失败');
      return res.json({
        rtn: -1,
        message: 'fail'
      });
    } else {
      logger.info('用户: ' + req.cookies.name + ' 删除多条播放列表 ' + req.body + '成功');
      return res.json({
        rtn: 0,
        message: 'success'
      });
    }

  });
}

exports.deleteusers2 = function(req, res) {

  return async.each(req.body, function(user, cb) {
    return User.findByIdAndRemove(Object(user), function(err,xUser) {
      if (err) {
        return res.send({
          rtn: -1,
          message:"fail"
        });
      }
   //   BoxUnionUser.remove({userId:user},function(err){
   //     if(err){
   //       console.log(err);
   //     }
   //     cb(null);
   //   })
   //   console.log(xUser);
   //   MediaUnionUser.remove({departId:xUser.departId},function(err){
   //   if(err){
   //     console.log(err);
   //   }
   // })
   // PlaylistUnionUser.remove({departId:xUser.departId},function(err){
   //   if(err){
   //     console.log(err);
   //   }
   // })
   //ScheduleUnionUser.remove({departId:xUser.departId},function(err){
   //   if(err){
   //     console.log(err);
   //   }
   // })
   // TaskUnionUser.remove({departId:xUser.departId},function(err){
   //   if(err){
   //     console.log(err);
   //   }
   // })
    
    });
  }, function(err) {
    if (err) {
      return res.send({
        rtn: -2,
        message:"fail"
      });
    }
    logger.info('用户: ' + req.cookies.username + ' 删除多用户 ' + req.body + ' 成功')
    return res.json({
      rtn: 0,
      message:"success"
    });
  });
};

exports.array = function(req, res) {
  return User.find({
    is_delete:0,
    //role: 'normal'
  }).exec(function(err, users) {
    var x;
    if (err) {
      return res.json({
        status: "fail"
      });
    }
    users = users || [];
    x = _.map(users, function(each) {
      each = _.pick(each, '_id', 'username', 'name', 'password', 'description', 'department');
      if (each.id === '') {
        each.id = each._id.toString();
      }
      return each;
    });
    return res.json(x);
  });
};

exports.userinfo = function(req, res) {
  return User.findOne({
    _id: req.params.uid
  }).exec(function(err, user) {
    return res.json({
      rtn: 0,
      message:"success",
      user: {
        name: user.name,
        description: user.description,
      }
    });
  });
}

//exports.updateUser = function(req, res) {
//  var user;
//  user = req.user;
//  return user.update(req.body).exec(function(err, user) {
//    if (err) {
//      return res.send({
//        status: "fail"
//      });
//    }
//    logger.info('用户: ' + req.cookies.username + ' 更新用户信息 ' + req.user.username + ' 成功')
//    return res.json({
//      status: "success"
//    });
//  });
//};

exports.updateUser = function(req, res) {

  console.log(req.body);
  User.update({_id:req.body._id},{$set:req.body},function(err){
    if(err){
      console.log(err);
      return res.json({
        rtn: -1,
        message:err
      });
    }
    return res.json({
      rtn: 0,
      message:'success'
    });
  })
};

exports.changePassword = function(req, res) {
  User.findById(req.params.uid).exec(function(err, user) {
    if (err) {
      return res.status(500).send({
        status: "fail"
      });
    }
    if (user.password != req.body.oldpassword) {
      return res.json({
        status: "fail",
        msg: "password error"
      })
    }

    user.password = req.body.newpassword

    user.save(function(err, user){
      if (err) {
        return res.json({
          status: "fail",
          msg: "unexception error"
        })
      }
      logger.info('用户: ' + req.cookies.username + ' 更新用户密码成功')

      res.json({
        status: "success"
      });

    })

  });
};
//exports.permission = function(){
//  console.log(req.body);
//  return User.find({
//    id:req.body
//  }).exec(function(err, users) {
//    var x;
//    if (err) {
//      return res.json({
//        status: "fail"
//      });
//    }
//    users = users || [];
//    x = _.map(users, function(each) {
//      each = _.pick(each, '_id', 'username', 'name', 'password','activated');
//      if (each.id === '') {
//        each.id = each._id.toString();
//      }
//      return each;
//    });
//    return res.json(x);
//  });
//};

//exports.authorize = function(req, res) {
//  return BoxUnionUser.find({
//    userId: req.user.id
//  }).exec(function(err, boxUnionUsers) {
//    if (err) {
//      return res.json({
//        status: "fail"
//      });
//    }
//    return async.each(boxUnionUsers,function(buu, callback) {
//      return buu.remove(function(err) {
//        if (err) {
//          return callback('remove buu fail');
//        }
//        return callback(null);
//      });
//    }, function(err) {
//      if (err) {
//        return res.json({
//          status: "fail",
//          message: err
//        });
//      }
//      return async.each(req.body,function(buu, callback) {
//        return BoxUnionUser.create({
//          userId: req.user.id,
//          boxId: buu.boxId,
//          look: buu.look,
//          setting:buu.setting
//        }, function(err, buu) {
//          if (err) {
//            return callback('create buu fail');
//          }
//          return callback(null);
//        });
//      }, function(err) {
//        if (err) {
//          return res.json({
//            status: "fail",
//            message: err
//          });
//        }
//        logger.info('用户: ' + req.cookies.username + ' 对用户: ' + req.user.id + ' 授权播放器成功')
//        return res.json({
//          status: 'success',
//          result: ''
//        });
//      });
//    });
//  });
//};


/**
 *  定义初始状态机
 */

exports.getmediaSize = function(req,res){

  console.log('ZXJ****');
  Setting.find(function(err,result){
    if(err){
      return res.json({
        status:'fail'
      })
    }
    console.log(result);
    var cap_value;
    var threshold_value;
    result.forEach(function(item){
      console.log(item);
      if(item.username=='mediaCap'){
        cap_value = item.value;
      }
      if(item.username=='mediaThreshold'){
        threshold_value = item.value;
      }
    })
    return res.json({
      state : 200,
      mediacap : cap_value,
      mediathreshold : threshold_value

    })
  })

};


exports.getInitState = function(req,res){

  //查询User表格，获取name和磁盘空间使用量userSace
  User.find(function(err,result){

    if(err){
      return res.json({
        state:502
      })
    }
    var userArr = [];//存在的用户名集合
    var userSpace = [];//各个用户名使用的磁盘空间
    if(!result){
      return res.json({
        state:502
      })
    }
    result.forEach(function(item){
      if(!item.userSpace || item.userSpace==''){
       // console.log(123123123);
        item.userSpace = 0;
      }
      userArr.push(item.username);
      userSpace.push(item.userSpace);
    });

    return res.json({
      state : 200,
      userArr : userArr,
      userSpace : userSpace

    })
  })


};



exports.getPersonInitState = function(req,res){

  var person_id = req.body.id;

  User.find(function(err,result){
    //console.log('************JING****************');
    //console.log(result);
    if(err){
      return res.json({
        status: 'fail'
      })
    }
    var userSpace = [];
    var userName = '';
    var userSize = '';
    if(!result){
      return res.json({
        status: 'fail'
      })
    }
    result.forEach(function(item){
      if(!item.userSpace || item.userSpace==''){
        item.userSpace = 0;
      }
      if(item.token == person_id){
        userName = item.username;
        userSize = item.userSpace;
      }
      userSpace.push(item.userSpace);
    });
    return res.json({
      state : 200,
      userName : userName,
      userSize :  userSize,
      userSpace : userSpace

    })
  })


};



var mongoose = require('mongoose')
var User = mongoose.model('User')
var md5 = require('./md5')

var installed = false

module.exports = function(req, res, next) {

  if (installed) {
    return next()
  }


  User.findOne({username: 'admin'}).exec(function(err, user) {
    if (err) {
      return res.render('error', {
        error: "unexception error"
      })
    }
    if (user) {
      if (user.departId == '') {
        user.departId = String(user._id);
        return user.save(function(err) {
          if (err) {
            return res.render('error')
          }
          installed = true
          next()
        })
        return next()
      }
      installed = true
      return next()
    }

    User.create({
      username: 'admin',
      password: md5('admin'),
      name: '管理员'
    }, function(err, admin) {
      if (err) {
        return res.render('error', {
          error: "初始化失败"
        })
      }
      admin.id = String(admin._id)
      admin.departId = String(admin._id)
      admin.token = String(admin._id)
      admin.save(function(err) {
        if (err) {
          return res.render('error')
        }
        installed = true
        next()
      })
    })

  })


}
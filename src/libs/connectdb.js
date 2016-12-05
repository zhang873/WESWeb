/**
 * Created by Hansel on 2015-08-08 12:20:39
 */

var express = require('express')
var mongoose = require('mongoose')
var _ = require('lodash')
var isConnected = false
var isConnecting = false

module.exports = function(req, res, next){


  if (isConnecting) {
    return res.render('error', {
      error: "db_error"
    })
  }

  if (isConnected) {
    return next()
  }

  var db = _.extend({delay: 3000},express.DB)

  connect(0, db)

  /**
   * connect mongodb.
   * @param {number} delay
   */
  function connect(delay, db) {


    setTimeout(function(){
      isConnecting = true
      mongoose.connect(db.uri, db.options, function(err) {
        if(err){
          console.log(err)
          if (delay == 0) {
            res.render('error', {
              error: "db_error"
            })
          }
          console.error("DB connected fail, connect again after "+db.delay/1000+" second")
          isConnected = false
          mongoose.connection.close()
          connect(db.delay, db)
        } else {
          isConnecting = false
          console.log("DB connected success on "+db.uri)
          isConnected = true
          if (delay == 0){
            next()
          }
          mongoose.connection.once("disconnected", function(){
            console.error('DB disconnected, trying to connect again...')
            isConnected = false
            connect(1, db)
          })
        }
      })
    }, delay)

  }

}
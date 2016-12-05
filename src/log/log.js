
/**
 * Created by Yancey on 2016/2/15.
 */
var log4js = require('log4js');
var conf = require('./conf.json');
var path = require('path');
var loggerList = {
  logger : log4js.getLogger('logInfo'),
  loggerAction : log4js.getLogger('logAction')
};

var logHelper =  {
  init : function(level,cb, app) {
    var self = this;
    if(!level){
      return cb('callback need')
    }else if(typeof level === 'function'){
      cb = level;
      level = "DEBUG";
    }
    if (typeof level !=='string'){
      return cb('level must be string');
    }
    if (typeof cb !== 'function'){
      return cb('callback must be function');
    }
    conf = logPathChange(conf);
    log4js.configure(conf);
    loggerList.logger.setLevel(level);
    loggerList.logger.info("日志初始化成功,日志等级:", level);
    self.connectLogger = log4js.connectLogger(loggerList.loggerAction, {level: 'auto'});
    cb(null, loggerList.logger);
  },
  connectLogger: null,
  use:function () {
    var self = this;
    return self.connectLogger;
  }
};

function logPathChange(conf) {
  for(var i in conf.appenders) {
    if(conf.appenders[i].filename) {
      conf.appenders[i].filename = path.join(__dirname, '../../', conf.appenders[i].filename)
    }
  }
  return conf;
}
module.exports = logHelper;

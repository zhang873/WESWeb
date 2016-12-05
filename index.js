var http = require('http')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var morgan = require('morgan')
var crypto = require('crypto')
var async = require('async')
var swig = require('swig')
var lessMiddleware = require('less-middleware')
var config = require('./src/config/default.config')
var _ = require('lodash')
var socketio = require('socket.io')

// 全局变量
express = _.extend(express, {
    TMP_DIR: 'files/tmp',
    MEDIA_STORAGE: 'files/media',
    SCREENSHOTS_STORAGE: 'public/Screenshots',
    LOGFILE_STORAGE: 'files/log',
    LOG_DAILY:'logs',
    PACKAGE_STORAGE: 'files/package',
    DB: config.db
})
// 加载Model
var models = require(path.join(__dirname, './src/models/index.server.model'))

//// 加载服务
//var serviceEntry = require('./src/services/serviceEntry')


// 创建app
var app = module.exports = express();



//加载日志模块
var loggerHelper = require('./src/log/log');
loggerHelper.init('DEBUG', function(err, logger) {
    if(err) console.error('加载日志模块失败:', err);
    else global.logger = logger;
}, app);
app.use(loggerHelper.use());

// 设置app模板引擎
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'html');
app.engine('html', swig.renderFile);
// 通用中间件
app.use(morgan(config.log.format, config.log.options))
app.use(bodyParser.json())
app.use(bodyParser.json({type: 'application/*+json'}))
app.use(bodyParser.json({type: 'text/html'}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(lessMiddleware(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public')))
// 自定义中间件
app.use(require(path.join(__dirname, './src/libs/connectdb')))
app.use(require(path.join(__dirname, './src/libs/checkInstall')))
// 路由中间件
app.use(require(path.join(__dirname, './src/routes/index.server.routes')))
//app.use(require(path.join(__dirname, './src/routes/log.server.routes')))
app.use(require(path.join(__dirname, './src/routes/login.server.routes')))
//app.use(require(path.join(__dirname, './src/routes/setting.server.routes')))
app.use(require(path.join(__dirname, './src/routes/user.server.routes')))
app.use(require(path.join(__dirname, './src/routes/custom.server.routes')))
app.use(require(path.join(__dirname, './src/routes/inventory.server.routes')))
app.use(require(path.join(__dirname, './src/routes/logistics.server.routes')))
app.use(require(path.join(__dirname, './src/routes/product.server.routes')))
app.use(require(path.join(__dirname, './src/routes/sales.server.routes')))
app.use(require(path.join(__dirname, './src/routes/warehouse.server.routes')))
app.use(require(path.join(__dirname, './src/routes/contract.server.routes')))
app.use(require(path.join(__dirname, './src/routes/department.server.routes')))
// 错误处理中间件
app.use(require(path.join(__dirname, './src/libs/err500')))
app.use(require(path.join(__dirname, './src/libs/err404')))
// 启动app
//serviceEntry.serviceManager.run()

var server = http.createServer(app)




//var io = socketio.listen(server);
//io.sockets.on('connection',function(socket){
//	console.log('socketio: new connect')
//	socket.on('disconnect',function(socket){
//		console.log('socketio: disconnect')
//	})
//
//	socket.on('message',function(socket){
//		console.log('socketio: message')
//	})
//})

//io.configure('development', function(){
//    io.enable('browser client etag');
//    io.set('log level', 1);
//});




server.listen(config.port, function(){
    console.log('WESWeb Started Success ' + 'Listen On Port ' + config.port);
    logger.info('WESWeb Started Success ' + 'Listen On Port ' + config.port);
})
  
//express.socketio = io
var createError = require('http-errors');
var express = require('express');
var expressWs = require('express-ws');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var websocket = require('./routes/websocket');
var wsClient = require('./service/wsclient');
var wSAvcPlayer = require('./service/wsAvcPlayer');
var socketClient = require('./service/socketClient');
var socketServer = require('./service/socketServer');

var app = express();
expressWs(app);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));//express.static是express提供的内置的中间件用来设置静态文件路径

//app.use(express.static('static'));//express.static是express提供的内置的中间件用来设置静态文件路径


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', websocket);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
//wsClient.init(); //这个是服务器作为client连别人
wSAvcPlayer.init();
//socketClient.init();
//socketServer.init();
app.listen(3002); //websocket端口监听用这个
module.exports = app;

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//Add router files here (controller like)
var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var search = require('./routes/search');
var book = require('./routes/book');
var mail = require('./routes/mail');
var messages = require('./routes/messages');
var app = express();



var socketioserver = require('http').createServer(function(req,res) {
    res.writeHead(400, {'Content-Type': 'text/html'});
    res.end('websocket server :)');
}).listen(3001, function() {
    console.log('listening on *:3001');
});

// no "var" keyword or the variable is local to this module.
io = require('socket.io')(socketioserver);

io.on('connection', function(socket){
    socket.on('message', function(msg){
      io.emit('message', msg);
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Add default routes to router (controller prefix like)
app.use('/', index);
app.use('/users', users);
app.use('/login', login);
app.use('/search', search);
app.use('/book', book);
app.use('/mail', mail);
app.use('/messages', messages);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.set('json spaces', '\t');

module.exports = app;

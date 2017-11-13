//generic modules
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');
const socketio = require('socket.io');

// custom modules
const config = require('./config');

//Add router files here (controller like)
const index = require('./routes/index');
const user = require('./routes/user');
const authenticate = require('./routes/authenticate');
const apartment = require('./routes/apartment');
const book = require('./routes/book');
const mail = require('./routes/mail');
const message = require('./routes/message');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb.url);
const app = express();


const socketioserver = http.createServer(function(req,res) {
    res.writeHead(400, {'Content-Type': 'text/html'});
    res.end('websocket server :)');
}).listen(3001, function() {
    console.log('listening on *:3001');
});

// no "var" keyword or the variable is local to this module.
io = socketio(socketioserver);

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

//routes
app.use('/', index);
app.use('/authenticate', authenticate);

//secure the following routes of this api
app.use(function (req, res, next) {
  let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;

  if (token) {
    jwt.verify(token, config.jwtSecret, function (err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  }
  else {
    return res.status(403).json({
      success: false,
      message: 'No token provided.'
    });
  }
});
app.use('/user', user);
app.use('/apartment', apartment);
app.use('/book', book);
app.use('/mail', mail);
app.use('/message', message);

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

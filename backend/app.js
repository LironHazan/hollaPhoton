var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./conf');

var leds = require('./LED');
var session = require('./Login');
var photoresistor = require('./Photoresistor');
var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('cookie-session')({
  secret: config.sessionSecret,
  cookie:{maxAge:600000}
}));
//app.use(express.static(path.join(__dirname, './public')));


/***********************************************************************
 *              Photon Routes Start
 **********************************************************************/
var router = express.Router();
router.use('/led', leds.controller); // all led routes goes throw /backend/led/
router.use('/session', session.controller);
router.use('/photoresistor', photoresistor.controller);

/***********************************************************************
 *              Photon Routes Stop
 **********************************************************************/
app.use('/backend', router); // all routes goes throw \backend

app.use(express.static(path.join(__dirname, '..')));
app.use(express.static(path.join(__dirname, '..', '.tmp')));
//app.use('/bower_components',express.static(path.join(__dirname, '..', './bower_components')));
app.use(express.static(path.join(__dirname, '..', 'app')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res/*, next*/) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res/*, next*/) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// general errors will be caught here
process.on('uncaughtException', function(err) {
  console.error('Caught exception: ' + err);
});

module.exports = app;

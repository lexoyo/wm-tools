const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cookieSession = require('cookie-session')

const indexRouter = require('./routes/index');
const meRouter = require('./routes/me');
const adsRouter = require('./routes/ads');
const flowsRouter = require('./routes/flows');

const FB = require('./fb');
const models = require('./models');

const app = express();

// facebook app setup
app.set('FB', FB);
app.set('models', models);

// cookie session
app.use(cookieSession({
  name: 'ac-session',
  keys: (process.env.SESSION_SECRET || 'kjnbç_8942').split(','),
  // maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/me', meRouter);
app.use('/ads', adsRouter);
app.use('/flows', flowsRouter);

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

module.exports = app;

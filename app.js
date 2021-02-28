var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('express-flash');
var session = require('express-session');

var fileUpload = require('express-fileupload');
var uuid = require('uuid');
var mysql = require('mysql');
var connection  = require('./lib/db');

var booksRouter = require('./routes/books');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var submitterRouter = require('./routes/submitter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  cookie: { maxAge: 360000 },
  store: new session.MemoryStore,
  saveUninitialized: true,
  resave: 'true',
  secret: 'secret'
}))

app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

app.use('/', indexRouter);
app.use('/auth', usersRouter);
app.use('/books', booksRouter);
app.use('/submitter',submitterRouter);

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

// app.listen(3000,()=>{
//   console.log('Server is running...!');
// });

module.exports = app;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const helpers = require('./helpers');

var mongoose = require('mongoose');
const dotenv = require('dotenv').config();

var mongodb = 'mongodb+srv://Laki_db_user:Laki220103@cluster0.7ljnqfb.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongodb);
mongoose.Promise = global.Promise;
var db = mongoose.connection;

db.on('error', console.error.bind(console, "MongoDB connection error"));

var indexRouter = require('./routes/index');
var locationsRouter = require('./routes/locationRoutes');
var usersRouter = require('./routes/userRoutes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

var session = require('express-session');
const MongoStore = require("connect-mongo");
app.use(session({
    secret: 'fF3yRj<mzmE*vHz',
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: mongodb})
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/locations', locationsRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
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

module.exports = app;

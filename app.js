const createError = require('http-errors');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const environment = require('./environments');

const router = require('./routes/route');
const sessionMiddleware = require('./middlewares/session.middleware');

mongoose.connect('mongodb+srv://node-rest:' + environment.MONGO_PASS + '@node-rest-s7o6w.gcp.mongodb.net/test?retryWrites=true&w=majority');
mongoose.Promise = global.Promise;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cookieParser("secret"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessionMiddleware);

app.use('/', router.indexRouter);
app.use('/users', router.usersRouter);
app.use('/signin', router.signinRouter);
app.use('/signup', router.signupRouter);
app.use('/tour', router.productRouter);
app.use('/contact', router.contactRouter);
app.use('/tour-trong-nuoc', router.tourInCountryRouter);
app.use('/customer', router.customerRouter);
app.use('/search', router.searchPageRouter);
app.use('/admin', router.adminRouter);

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

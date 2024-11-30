var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var setupSwagger = require('./swagger');
const methodOverride = require('method-override');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var postFormRouter = require('./routes/postForm');
var teachersRouter = require('./routes/teachers');
var teacherFormRouter = require('./routes/teacherForm');
var studentsRouter = require('./routes/students');
var authRouter = require('./routes/auth');
const { errorMiddleware } = require('./middlewares/errorMiddleware');
const cors = require('cors');
require('dotenv').config();

var app = express();

// to accept requests from any origin
// app.use(cors());

// for app to accept requests from the frontend running on port 5173 locally
app.use(cors({ origin: process.env.FRONTEND_HOST }));

setupSwagger(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/postForm', postFormRouter);
app.use('/teachers', teachersRouter);
app.use('/teacherForm', teacherFormRouter);
app.use('/students', studentsRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.get('/postForm', (req, res) => {
  res.render('postForm');
});

app.use(errorMiddleware);

module.exports = app;

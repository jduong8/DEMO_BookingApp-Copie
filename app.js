const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler.middleware')

var app = express();

app.use(cors({ origin: 'http://localhost:8000' }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(errorHandler);
app.use('/api', indexRouter);

module.exports = app;

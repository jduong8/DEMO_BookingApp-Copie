require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const SECRET_KEY = process.env.SECRET_KEY;


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const verifyJWT = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) return res.status(401).json({ auth: false, message: 'Token required' });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (e) {
        res.status(400).json({ auth: false, message: 'Incorrect token.' });
    }
};

app.use('/api', verifyJWT, indexRouter);

module.exports = app;

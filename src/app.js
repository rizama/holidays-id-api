const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');
const controller = require('./api/controller');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
    windowMs: 30 * 1000,
    max: 20
});

const speedLimiter = slowDown({
    windowMs: 30 * 1000,
    delayAfter: 1,
    delayMs: 500
});

app.get('/', controller.index);
app.get('/holidays/:year', limiter, controller.holiday);
app.get('/school-holidays/:year/:city', limiter, controller.schoolHoliday);

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;

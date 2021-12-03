const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');

const indexRouter = require('./routes/');
const creditRouter = require('./routes/credit');
// const scoreRouter = require('./routes/score');
const valueRouter = require('./routes/value');

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// const errorHandler = require('./middleware/errorHandler');

const app = express();

const options = require("../swaggerAPI.json");
const specs = swaggerJsdoc(options);

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { customCss: '.swagger-ui .topbar { background-color:#6c3778 } ' })
);


app.use(helmet()); // https://expressjs.com/en/advanced/best-practice-security.html#use-helmet
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/credit', creditRouter);
// app.use('/score', scoreRouter);
app.use('/value', valueRouter);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError.NotFound());
});

// pass any unhandled errors to the error handler
// app.use(errorHandler);

module.exports = app;
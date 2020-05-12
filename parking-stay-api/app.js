/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-restricted-properties */
const jwt = require('jsonwebtoken');
const express = require('express');
const serverless = require('serverless-http');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const bearerToken = require('express-bearer-token');
const mongoose = require('mongoose');
var mung = require('express-mung');
var cors = require('cors');

const app = express();
const port = 10000;

var users = require('./routes/userRoutes');
const parkingStayRoute = require('./routes/parkingStayRoute');

app.use(mung.json(
  (body, req, res) => {
    var reponseBody = body;
    reponseBody.message = body.message || 'Successfull request!';
    reponseBody.code = reponseBody.code != null ? reponseBody.code : res.statusCode;
    return reponseBody;
  }
));

require('dotenv').config();

mongoose.connect('mongodb://localhost:27017/parkingLot', { useNewUrlParser: true })
  .then((db) => console.log('Connected to Database'))
  .catch((error) => console.error(error));

app.use(morgan('combined'));
app.use(cors());
app.use(bearerToken());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/users', users);
app.use('/parkingstay', parkingStayRoute);

app.get('/', (req, res) => {
  res.send('Wellcome to parking way API');
});

app.listen(port, () => {
  debug(`listening on port ${chalk.green(port)}`);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).json({ code: 404, message: 'Not Found', payload: {} });
  next(res);
});

// catch UnauthorizedError and forward to error handler
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ code: 401, message: 'Invalid token', payload: {} });
    next(res);
  }
});


module.exports.handler = serverless(app);

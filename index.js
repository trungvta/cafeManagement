const express = require('express');
var cors = require('cors');
const connection = require('./connecttion');
const userRoute = require('./router/user');
const dashboardRoute = require('./router/dasboard');

const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/user', userRoute);
app.use('/', dashboardRoute);

module.exports = app;
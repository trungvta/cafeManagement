const express = require('express');
var cors = require('cors');
const connection = require('./connecttion');

//Router
const dashboardRoute = require('./router/dasboard');
const userRoute = require('./router/user');
const categoryRoute = require('./router/category');
const productRoute = require('./router/product');
const billRoute = require('./router/bill');

const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/', dashboardRoute);
app.use('/user', userRoute);
app.use('/category', categoryRoute);
app.use('/product', productRoute);
app.use('/bill', billRoute);

module.exports = app;
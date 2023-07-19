const express = require('express');
var cors = require('cors');
const connection = require('./connecttion');

//mongo
// const { client } = require('./connectionDB');
// client.connect();

//mongo

//Router
const dashboardRoute = require('./router/dasboard');
const userRoute = require('./router/user');
const categoryRoute = require('./router/category');
const productRoute = require('./router/product');
const billRoute = require('./router/bill');
//Router

//MG
const productMongoRoute = require('./router/productMongo');


const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/dashboard', dashboardRoute);
app.use('/user', userRoute);
app.use('/category', categoryRoute);
app.use('/product', productRoute);
app.use('/bill', billRoute);

app.use('/productMongo', productMongoRoute);

module.exports = app;
require('dotenv').config();

const express = require('express');
const connection = require('../connecttion');
const router = express.Router();

// support
let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
var fs = require('fs');
var uuid = require('uuid');

// authen
var auth = require('../services/authentication');

router.post('/generateReport', auth.authenticateToken, (req, res, next) => {
    const generatedUuid = uuid.v1();
    const orderDetails = req.body;
    console.log(orderDetails.productDetails)
    var productDetailsReport = JSON.parse;

    query = "insert into bill (name,uuid,email,contactNumber,paymentMethod,total,productDetails,createBy) values(?,?,?,?,?,?,?,?)";
    connection.query(query, [orderDetails.name,generatedUuid,orderDetails.email,orderDetails.contactNumber,orderDetails.paymentMethod,orderDetails.totalAmount,orderDetails.productDetails,res.locals.email], (err,results) => {
        if(!err) {
            console.log('pdf.create');

            ejs.renderFile(path.json(__dirname,'',"report.ejs"),{productDetails:productDetailsReport,name:orderDetails.name,email:orderDetails.email,contactNumber:orderDetails.contactNumber,paymentMethod:orderDetails.paymentMethod,totalAmount:orderDetails.totalAmount},(err,result) => {
                if(err) {
                    return res.status(500).json(err)
                }
                else 
                pdf.create(result).toFile('./generated_pdf/' + generatedUuid + ".pdf", (err,data) => {
                    if(err) {
                        return res.status(500).json(err)
                    } 
                    else
                        return res.status(200).json({uuid: generatedUuid})
                })
            })
        }
        else {
            console.log('connection err');
            return res.status(500).json(err)
        }
    })
});



module.exports = router;
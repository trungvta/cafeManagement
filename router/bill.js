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

router.post('/generateReport', auth.authenticateToken, (req, res) => {
    const generatedUuid = uuid.v1();
    const orderDetails = req.body;
    var productDetailsReport = JSON.parse(orderDetails.productDetails);

    console.log('generatedUuid:', generatedUuid);
    console.log('Email:', res.locals.email);

    query = "insert into bill (name,uuid,email,contactNumber,paymentMethod,total,productDetails,createBy) values(?,?,?,?,?,?,?,?)";
    connection.query(query, [orderDetails.name,generatedUuid,orderDetails.email,orderDetails.contactNumber,orderDetails.paymentMethod,orderDetails.totalAmount,orderDetails.productDetails,res.locals.email], (err,results) => {
        if(!err) {

            console.log('!err');

            const filePath = path.join(__dirname,'',"report.ejs");
            ejs.renderFile( filePath, {productDetails:productDetailsReport,name:orderDetails.name,email:orderDetails.email,contactNumber:orderDetails.contactNumber,paymentMethod:orderDetails.paymentMethod,totalAmount:orderDetails.totalAmount},(err,result) => {
                if(err) {
                    return res.status(500).json(err)
                }

                else 
                pdf.create(result).toFile('./generated_pdf/' + generatedUuid + ".pdf", (err,data) => {
                    return (err) ? res.status(500).json(err) : res.status(200).json({uuid: generatedUuid});
                })
            })
        }
        else {

            console.log('500');

            return res.status(500).json(err)
        }
    })
});

router.post('/getPDF', auth.authenticateToken, (req, res) => {
    const orderDetails = req.body;

    console.log(orderDetails);

    const pdfPath = './generated_pdf/' + orderDetails.uuid + '.pdf';

    console.log(pdfPath);

    if(fs.existsSync(pdfPath)) {
        res.contentType("application/pdf");
        fs.createReadStream(pdfPath).pipe(res);
    }

    else {
        var productDetailsReport = JSON.parse(orderDetails.productDetails);

        const filePath = path.join(__dirname,'',"report.ejs");
        ejs.renderFile( filePath, {productDetails:productDetailsReport,name:orderDetails.name,email:orderDetails.email,contactNumber:orderDetails.contactNumber,paymentMethod:orderDetails.paymentMethod,totalAmount:orderDetails.totalAmount},(err,result) => {
            if(err) {
                return res.status(500).json(err)
            }

            else {
                console.log('orderDetails.uuid', orderDetails.uuid);
                pdf.create(result).toFile('./generated_pdf/' + orderDetails.uuid + ".pdf", (err,data) => {
                    if (err) res.status(500).json(err) 
                    else {
                        res.contentType("application/pdf");
                        fs.createReadStream(pdfPath).pipe(res);
                    }
                })
            }
        });

    }
});

router.get('/getBills', auth.authenticateToken, (req,res) => {
    var query = "select *from bill order by id DESC";

    connection.query(query, (err, results) => {
        if(!err) {
            return res.status(200).json(results)
        }
        else { 
            return res.status(500).json(err)
        }
    })
})

router.delete('/delete/:id', auth.authenticateToken, (req,res) => {
    var query = "delete from bill where id=?";

    connection.query(query, [req.params.id], (err, results) => {
        if(!err) {
            if(results.affectedRows == 0) {
                return res.status(404).json({messsage: "Bill Id does not found"})
            }
            return res.status(200).json({messsage: "Bill Deleted Successfully"})
        }
        else { 
            return res.status(500).json(err)
        }
    })
})

module.exports = router;
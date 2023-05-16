const express = require('express');
const connection = require('../connecttion');
const router = express.Router();

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

router.post('/signup', (req, res) => {
    let user = req.body;
    query = "select email,password,role,status from user where email=?";
    connection.query(query, [user.email], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length > 0) return res.status(400).json({ message: "Email Already Exist." })
        query = "insert into user(name,contactNumber,email,password,status,role) values(?,?,?,?,'false','user')";
        connection.query(query, [user.name, user.contactNumber, user.email, user.password], (err, complate) => {
            if (!err) {
                return res.status(200).json({ message: "Successfully Resgistered" });
            }

            return res.status(500).json(err);
        })

    })
})

router.post('/login', (req, res) => {
    let user = req.body;
    query = "select email,password,role,status from user where email=?";
    connection.query(query, [user.email], (err, result) => {

        if (err) return res.status(500).json(err);

        if (result.length <= 0 || result[0].password != user.password) {
            return res.status(401).json({
                message: 'Incorrect Username or password'
            })
        }
        else if (result[0].status === 'false') {
            return res.status(401).json({
                message: 'Waiting for Admin Approval'
            })
        }
        else if (result[0].password == user.password) {
            const response = {
                email: result[0].email,
                role: result[0].role
            }
            const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN);
            res.status(200).json({
                token: accessToken
            })
        }
        else {
            return res.status(400).json({
                message: 'Something went wrong.'
            })
        }
    })
})

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    }
})

router.post('/forgotPassword', (req, res) => {
    const user = req.body;
    query = "select email,password from user where email=?";
    connection.query(query,[user.email],(err,result) => {

        if (err) return res.status(500).json(err);

        if(!err) {
            if (result.length <= 0) {
                return res.status(200).json({
                    message: "if Password sent sucessfully to your email",
                    email: user.email,
                    user: process.env.EMAIL,
                    check: result
                })
            }

            else {
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: result[0].email,
                    subject: 'Password by Cafe Management System',
                    html: '<p><b> Your Login details for Cafe Management System </b><br> <b>Email: </b>' + result[0].email + '<br> <b>Password: </b>' + result[0].password + '<br> <a href="http://localhost:8080/user/login"> Click here to Login </a>' + '</p>'
                }
    
                transporter.sendMail(mailOptions, (err, result) => {
                    if (err) {
                        console.log('err', err);

                    } else {
                        console.log('Email sent: ', result.response)
                    }
                })
    
                return res.status(200).json({
                    message: "else Password sent successfully yo your email",
                    resultMail: result[0].email,
                    resultPass: result[0].password,

                })
            }
        }

        return res.status(200).json({
            message: "Password sent sucessfully to your email"
        })

    })
})

module.exports = router;
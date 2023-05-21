require('dotenv').config();

const express = require('express');
const connection = require('../connecttion');
const router = express.Router();

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

//
const { OAuth2Client } = require('google-auth-library');

// authen
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

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

// Khởi tạo OAuth2Client với Client ID và Client Secret 
const myOAuth2Client = new OAuth2Client(
    process.env.GOOGLE_MAILER_CLIENT_ID,
    process.env.GOOGLE_MAILER_CLIENT_SECRET
);

// Set Refresh Token vào OAuth2Client Credentials
myOAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN
});

router.post('/forgotPassword', (req, res) => {
    const user = req.body;
    query = "select email,password from user where email=?";
    connection.query(query,[user.email], async (err,result) => {

        if (err) return res.status(500).json(err);

        if(!err) {
            if (result.length <= 0) {
                return res.status(200).json({
                    message: "if Password sent sucessfully to your email",
                    result: result,
                    mailFrom: req.body
                })
            }

            else {

                const myAccessTokenObject = await myOAuth2Client.getAccessToken();
                const myAccessToken = myAccessTokenObject?.token;

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      type: 'OAuth2',
                      user: process.env.ADMIN_EMAIL_ADDRESS,
                      clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
                      clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
                      refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
                      accessToken: myAccessToken
                    }
                });

                var mailOptions = {
                    to: user.email,
                    subject: 'Password by Cafe Management System',
                    html: '<p><b> Your Login details for Cafe Management System </b><br> <b>Email: </b>' + result[0].email + '<br> <b>Password: </b>' + result[0].password + '<br> <a href="http://localhost:8080/user/login"> Click here to Login </a>' + '</p>'
                }
    
                await transporter.sendMail(mailOptions, (err, result) => {
                    if (err) { console.log('err', err) } 
                    else { console.log('Email sent: ', result.response)}
                })
    
                return res.status(200).json({
                    message: "else Password sent successfully yo your email",
                })
            }
        }

        return res.status(200).json({
            message: "Password sent sucessfully to your email"
        })

    })
})

router.get('/get', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    var query = "select id,name,email,contactNumber,status from user where role='user'";
    connection.query(query, (err, result) => {
        if(!err) {
            return res.status(200).json(result);
        }
        else {
            return res.status(500).json(err)
        }
    })
})

router.patch('/update', (req, res) => {
    let user = req.body;
    var query = "update user set status=? where id=?";
    connection.query(query, [user.status, user.id], (err, result) => {
        if(!err) {
            if(result.affectedRows == 0) {
                return res.status(404).json({
                    message: "User id does not exist"
                })
            }
            return res.status(200).json({
                message: "User Updated Successfully"
            })
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/checkToken', auth.authenticateToken, (req, res) => {
    return res.status(200).json({
        message: "true"
    });
})

router.post('/changePassword', auth.authenticateToken, (req, res) => {
    const user = req.body;
    const email =  res.locals.email;
    var query = "select * from user where email=? and password=?";
    connection.query(query, [email, user.oldPassword], (err, result) => {
        if(err) return res.status(500).json(err);
        else {
            console.log('user res', result)
            if(result.length <= 0) {
                return res.status(400).json({
                    message: "Incorrect Old Password"
                })
            }
            else if(result[0].password == user.oldPassword) {
                query = "update user set password=? where email=?";
                connection.query(query, [user.newPassword, email], (err, result) => {
                    if(err) return res.status(500).json(err);
                    else {
                        return res.status(200).json({
                            message: "Password Update Successfully"
                        })
                    }

                })
            }
        }
    })
})

module.exports = router;
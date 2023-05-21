require('dotenv').config();

const express = require('express');
const connection = require('../connecttion');
const router = express.Router();

// authen
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/add', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let category = req.body;
    console.log(category);
    console.log('asdkasjkdsajd')
    query = "insert into category (name) values(?)";
    connection.query(query, [category.name], (err,results) => {
        if(!err) {
            return res.status(200).json({
                message: "Category added successfully"
            })
        }
        else {
            return res.status(500).json(err)
        }
    })
});

router.get('/get', auth.authenticateToken, (req, res, next) => {
    var query = "select * from category order by name";
    connection.query(query, (err, results) => {
        if(!err) {
            res.status(200).json(results)
        }
        else {
            res.status(500).json(err)
        }
    })
})

router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let product = req.body;
    console.log(product)
    var query = "update category set name=? where id=?";
    connection.query(query, [product.name, product.id], (err, results) => {
        if(!err) {
            if(results.affectedRows == 0) {
                res.status(404).json({
                    message: "Category is does not found"
                })
            }
            return res.status(200).json({
                message: "Category Update Sucessfully"
            })
        }
        else {
            return res.status(500).json(err)
        }
    })
})

module.exports = router;
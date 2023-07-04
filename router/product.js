require('dotenv').config();

const express = require('express');
const connection = require('../connecttion');
const connectionDB = require('../connectionDB');

const router = express.Router();

var path = '';
router.use((req, res, next) => {
    path = req.baseUrl.split('/').join(' ');

    connectionDB.createCollect(path);

    // // Lấy danh sách các bảng trong cơ sở dữ liệu
    // const collections = database.listCollections().toArray();
    // const collectionNames = collections.map((collection) => collection.name);
    // // Kiểm tra xem bảng có tồn tại hay không
    // if (collectionNames.includes(collectionName)) {
    //     console.log(`Bảng ${collectionName} đã tồn tại`);

    //     // Lấy đối tượng bảng
    //     const collection = database.collection(collectionName);

    //     // Insert a document into the collection
    //     collection.insertOne({ name: 'Trung', age: 30 });
    //     console.log(`Inserted ${result.insertedCount} document into the collection`);
    // } else {
    //     const collection = database.createCollection(collectionName);
    //     console.log(`Created collection: ${collection.collectionName}`);
        
    //     // Insert a document into the collection
    //     collection.insertOne({ name: 'Trung', age: 30 });
    //     console.log(`Inserted ${result.insertedCount} document into the collection`);
    // }
    
    next();
});


// authen
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/add', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    let product = req.body;
    query = "insert into product (name, categoryId, description, price, status) values(?,?,?,?,'true')";
    connection.query(query, [product.name,product.categoryId,product.description,product.price], (err,results) => {
        if(!err) {
            return res.status(200).json({
                message: "Product added successfully"
            })
        }
        else {
            return res.status(500).json(err)
        }
    })
});

router.get('/get', auth.authenticateToken, (req, res, next) => {
    var query = "select p.id,p.name,p.description,p.price,p.status,c.id as categoryId,c.name as categoryName from product as p INNER JOIN category as c where p.categoryId = c.id";
    connection.query(query, (err, results) => {
        if(!err) {
            res.status(200).json(results)
        }
        else {
            res.status(500).json(err)
        }
    })
});

router.get('/getByCategory/:id', auth.authenticateToken, (req, res, next) => {
    console.log('trung');
    
    const id = req.params.id;
    var query = "select id,name from product where categoryID=? and status='true'";
    connection.query(query, [id], (err, results) => {
        if(!err) {
            res.status(200).json(results)
        }
        else {
            res.status(500).json(err)
        }
    })
});

router.get('/getById/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    var query = "select id,name,description,price from product where id=?";
    connection.query(query, [id], (err, results) => {
        if(!err) {
            res.status(200).json(results[0])
        }
        else {
            res.status(500).json(err)
        }
    })
});

router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let product = req.body;
    var query = "update product set name=?,categoryId=?,description=?,price=? where id=?";
    connection.query(query, [product.name,product.categoryId,product.description,product.price,product.id], (err, results) => {
        if(!err) {
            if(results.affectedRows == 0) {
                res.status(404).json({
                    message: "Product is does not found"
                })
            }
            res.status(200).json({
                message: "Product Updated Successfully"
            })
        }
        else {
            res.status(500).json(err)
        }
    })
});

router.delete('/delete/:id', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    const id = req.params.id;
    var query = "delete from product where id=?";
    connection.query(query, [id], (err, results) => {
        if(!err) {
            if(results.affectedRows == 0) {
                res.status(404).json({
                    message: "Product is does not found"
                })
            }
            res.status(200).json({
                message: "Product Deleted Successfully"
            })
        }
        else {
            res.status(500).json(err)
        }
    })
});

router.patch('/updateStatus', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let user = req.body;
    var query = "update product set status=? where id=?";
    connection.query(query, [user.status,user.id], (err, results) => {
        if(!err) {
            if(results.affectedRows == 0) {
                res.status(404).json({
                    message: "Product is does not found"
                })
            }
            res.status(200).json({
                message: "Product Status Updated Successfully"
            })
        }
        else {
            res.status(500).json(err)
        }
    })
});

module.exports = router;
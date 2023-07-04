require('dotenv').config();

const express = require('express');
const { connection } = require('../connectionDB');
const router = express.Router();

var path = '';
router.use((req, res, next) => {
    path = req.baseUrl.split('/').join('');

    // collectDB.collect(path);

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

router.post('/add', (req, res) => {
    const body = req.body;

    connection(process.env.DBMongoName, path)
        .addRecord(body)
        .then(result => {
            console.log('réult', result);
            if(result == null) {
                return res.status(400).json({
                    message: "Bad Request"
                });
            } else {
                return res.status(200).json({
                    message: "Product added successfully"
                })
            }
        }).catch((err) => {
            return res.status(500).json(err);
        });

    // collection.insertOne({ name: 'sdsd', age: 20 });
});

router.get('/get', (req, res, next) => {
    connection(process.env.DBMongoName, path)
        .getRecord()
        .then(result => {
            console.log('result', result);
            if(result == null) {
                return res.status(400).json({
                    message: "Bad Request"
                });
            } else {
                return res.status(200).json(result)
            }
        }).catch((err) => {
            return res.status(500).json(err);
        });
});

router.get('/getByCategory/:id', auth.authenticateToken, (req, res, next) => {
    console.log('trung');
    
    const id = req.params.id;
    var query = "select id,name from product where categoryID=? and status='true'";
   
});

router.get('/getById/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    var query = "select id,name,description,price from product where id=?";
   
});

router.patch('/update', (req, res, next) => {
    let data = req.body;
    const query = req.body.id;
    
    connection(process.env.DBMongoName, path)
        .updateRecord(query, data)
        .then(result => {
            console.log('result', result);
            if(result == null) {
                return res.status(400).json({
                    message: "Bad Request"
                });
            } else {
                return res.status(200).json({
                    message: "Update successfully"
                })
            }
        }).catch((err) => {
            return res.status(500).json(err);
        });
});

router.delete('/delete/:id', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    const id = req.params.id;
    var query = "delete from product where id=?";
    
});

router.patch('/updateStatus', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let user = req.body;
    var query = "update product set status=? where id=?";
});

module.exports = router;
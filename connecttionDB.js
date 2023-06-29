const { MongoClient } = require('mongodb');
require('dotenv').config();

// Khai báo URI kết nối tới MongoDB server và tên database
const uriString = 'mongodb://localhost:27017/mydb';

// Khởi tạo một MongoClient để kết nối với MongoDB server
const clientDB = new MongoClient(uriString, { useUnifiedTopology: true });

// Kết nối tới MongoDB server và tạo collection

const client = clientDB.connect();
    // console.log('async connect')
    // try {
    //     // Kết nối tới MongoDB server
    //     await clientDB.connect();
    //     return clientDB.db('mydb');

    // } catch (err) {
    //     console.log(err);
    // } finally {
    //     // Đóng kết nối khi hoàn thành
    //     await clientDB.close();
    // } 

const collectDB = {
  
    collect: async (collectionName,) => {
        try {

        console.log('=================================================== createCollect', clientDB);

        const client = await clientDB.connect();
        const database = client.db('mydb');

        // Lấy danh sách các bảng trong cơ sở dữ liệu
        const collections = await database.listCollections().toArray();
        const collectionNames = collections.map((collection) => collection.name);

        // Kiểm tra xem bảng có tồn tại hay không
        if (collectionNames.includes(collectionName)) {
            console.log(`Bảng ${collectionName} đã tồn tại`);

            // Lấy đối tượng bảng
            const collection = database.collection(collectionName);

            // Insert a document into the collection
            collection.insertOne({ name: 'John', age: 30 });
        } else {
            const collection = await database.createCollection(collectionName);
            console.log(`Created collection: ${collection.collectionName}`);
            
            // Insert a document into the collection
            collection.insertOne({ name: 'John', age: 30 });
        }

        client.close();
        } catch (err) {
        console.error(err);
        }
    }
}


function checkListColllections(checkName) {
    
}

module.exports = {
    client: client,
    collectDB: collectDB
};
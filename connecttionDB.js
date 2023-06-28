const { MongoClient } = require('mongodb');

// Khai báo URI kết nối tới MongoDB server và tên database
const uriString = 'mongodb://localhost:27017/mydb';

// Khởi tạo một MongoClient để kết nối với MongoDB server
const clientDB = new MongoClient(uriString, { useUnifiedTopology: true });

// async function createCollection() {
//   try {
//     // Kết nối tới MongoDB server
//     await client.connect();

//     // Chọn database để thao tác
//     const database = client.db('mydb');

//     // Tạo một collection mới và lưu trữ đối tượng Collection
//     const collection = await database.createCollection('mycollection');

//     // In ra thông tin của collection mới tạo
//     console.log(`Created collection: ${collection.collectionName}`);
//   } catch (err) {
//     console.error(err);
//   } finally {
//     // Đóng kết nối khi hoàn thành
//     await client.close();
//   }
// }

// createCollection();


// Gọi hàm để tạo collection
// Kết nối tới MongoDB server và tạo collection

const connectionDB = {
  
  createCollect: async (collectionName) => {
    try {
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
        console.log(`Inserted ${result.insertedCount} document into the collection`);
      } else {
        const collection = await database.createCollection(collectionName);
        console.log(`Created collection: ${collection.collectionName}`);
        
        // Insert a document into the collection
        collection.insertOne({ name: 'John', age: 30 });
        console.log(`Inserted ${result.insertedCount} document into the collection`);
      }

      client.close();
    } catch (err) {
      console.error(err);
    }
  }
}


module.exports = connectionDB;

// Gọi hàm để tạo collection
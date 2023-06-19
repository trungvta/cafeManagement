const { MongoClient } = require('mongodb');

// Khai báo URI kết nối tới MongoDB server và tên database
const uri = 'mongodb://localhost:27017/mydb';

// Khởi tạo một MongoClient để kết nối với MongoDB server
const client = new MongoClient(uri, { useUnifiedTopology: true });

// Kết nối tới MongoDB server và tạo collection
async function createCollection() {
  try {
    // Kết nối tới MongoDB server
    await client.connect();

    // Chọn database để thao tác
    const database = client.db('mydb');

    // Tạo một collection mới và lưu trữ đối tượng Collection
    const collection = await database.createCollection('mycollection');

    // In ra thông tin của collection mới tạo
    console.log(`Created collection: ${collection.collectionName}`);
  } catch (err) {
    console.error(err);
  } finally {
    // Đóng kết nối khi hoàn thành
    await client.close();
  }
}

// Gọi hàm để tạo collection
createCollection();
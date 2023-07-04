const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

// Khai báo URI kết nối tới MongoDB server và tên database
const uriString = 'mongodb://localhost:27017';

// Khởi tạo một MongoClient để kết nối với MongoDB server
const clientDB = new MongoClient(uriString, { useUnifiedTopology: true });

// Kết nối tới MongoDB server và tạo collection
const dbClient = {
    connect: async () => {
        try {
            // Kết nối tới MongoDB server
            await clientDB.connect();
        } catch (err) {
            console.log('dbClient Error ================================', err);
        } 
    },
    close: async () => {
        try {
            await this.clientDB.client.close();
            console.log('Đóng kết nối MongoDB thành công');
        } catch (err) {
            console.log('Đóng kết nối MongoDB thất bại: ' + err.message);
        }
    }
}

// const connection = {
//     addRecord: async (databaseName, collectionName, data) => {
//         console.log(databaseName);
//         console.log(collectionName);
//         console.log(data);

//         const collection = clientDB.db(databaseName).collection(collectionName);
//         collection.insertOne(data);
//     },

//     updateRecord: async (databaseName, collectionName, filter, data) => {
//         const collection = clientDB.db(databaseName).collection(collectionName);
//         await collection.updateOne(filter, { $set: data });
//     },

//     deleteRecord: async (databaseName, collectionName, filter) => {
//         const collection = clientDB.db(databaseName).collection(collectionName);
//         await collection.deleteOne(filter);
//     }
// }

const connection = (databaseName, collectionName) => {
    try {
        const dbCollection = clientDB.db(databaseName).collection(collectionName);
        
        return {
            getRecord: async () => {
                try {
                    const result = await dbCollection.find().toArray();
                    return result;
                } catch (error) {
                    console.error('Error in getAllRecords:', error);
                    return null;
                }
            },
            addRecord: async (data) => {
                try {
                    await dbCollection.insertOne(data);
                    return true;
                } catch (error) {
                    console.error('Error in addRecord:', error);
                    return null;
                }
            },

            updateRecord: async (query, data) => {
                console.log(query)
                const filter = { _id: ObjectId(query) };

                console.log('filter', filter);
                try {
                    await dbCollection.updateOne(filter, { $set: data });
                    return true;
                } catch (error) {
                    console.error('Error in addRecord:', error);
                    return null;
                }

            },

            deleteRecord: async (filter) => {
                console.log('deleteRecord', data);

                return dbCollection.deleteOne(filter);
            }
        };
    } catch (error) {
        console.error("Error connecting to database:", error);
        return null;
    }
};

const dbCollection = {
  
    collect: async (collectionName) => {
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

// const dbConnect = dbClient.connect();

module.exports = {
    client: dbClient,
    connection: connection,
    collection: dbCollection
};
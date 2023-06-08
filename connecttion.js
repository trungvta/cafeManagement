const mysql = require('mysql2');
require('dotenv').config();

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME // connect DB NAME
});

connection.connect((err) => {
    if(!err) {      
        console.log('connected')
    } else {
        console.log(err);
        console.log('error');
    }
})

module.exports = connection;
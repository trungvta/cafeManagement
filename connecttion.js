const mysql = require('mysql2');
require('dotenv').config();

var connection = mysql.createConnection({
    port: '3306',
    host: 'localhost',
    user: 'root',
    password: 'Trung123',
    database: 'dbTest'
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
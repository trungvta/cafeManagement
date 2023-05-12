require('dotenv').config();
const http = require('http');
const app = require('./index');

const hostname = 'localhost';
const port = 8080;

const server = http.createServer(app);
server.listen(port , hostname, () => {
    console.log('Server running at http://' + hostname + ':' + port + '/')
});

// app.listen(3000, function(res, req) {
//     console.log('http: 3000')
// })
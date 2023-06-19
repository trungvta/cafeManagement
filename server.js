require('dotenv').config();
const http = require('http');
const app = require('./index');

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
	console.log('http://localhost:' + process.env.PORT)
	console.log(`Express running → PORT ${server.address().port}`);
});

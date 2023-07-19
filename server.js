console.log('asd klnasdkjl asdjk asdklj asdj lasdjklasd lkjlasd lkjasd jkl');

require('dotenv').config();
const http = require('http');
const app = require('./index');

const server = http.createServer(app);

server.listen(8080, () => {
	console.log('http://localhost:' + process.env.PORT)
	console.log(`Express running → PORT ${server.address().port}`);
});

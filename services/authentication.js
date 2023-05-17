require('dotenv').config();
const jwt = require('jsonwebtoken');

function authenticateToken(req,res,next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split('')[1];
    if(token == null)
    return res.sendStatus(401);

    console.log('ACCESS_TOKEN', process.env.ACCESS_TOKEN)
    console.log('token', token)

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, response) => {
        if(err) return res.sendStatus(403)

        res.locals = response;
        next();
    })
}

module.exports = {
    authenticateToken: authenticateToken
}
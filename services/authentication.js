require('dotenv').config();
const jwt = require('jsonwebtoken');

function authenticateToken(req,res,next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) {
        return res.sendStatus(401);
    }

    // Kiểm tra nếu token là token cũ
    if (isOldToken(token)) {
        return res.sendStatus(403);
    }

    console.log('authenticateToken', token);

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, response) => {
        if(err) return res.sendStatus(403)
        console.log('res', response);
        res.locals = response;
        next();
    })
}

function isOldToken(token) {
    // Thực hiện kiểm tra token có phải là token cũ hay không
    // Điều kiện kiểm tra ở đây, bạn có thể tuỳ chỉnh dựa trên yêu cầu cụ thể
    // Ví dụ:
    // Kiểm tra nếu token hết hạn (expired)
    // Kiểm tra nếu token được tạo từ một ngày trước định rõ
    // ...
    
    // Trả về true nếu token là token cũ, ngược lại trả về false
    return false; // Thay đổi giá trị ở đây theo yêu cầu
}

module.exports = {
    authenticateToken: authenticateToken
}
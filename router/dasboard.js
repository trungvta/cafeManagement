const express = require('express');

const connection = require('../connecttion');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Dashboard');
})

module.exports = router;
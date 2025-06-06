const jwt = require('jsonwebtoken');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const validateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('No token provided')

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified
        next()
    } catch (error) {
        res.status(400).send('Invalid token')
    }
}

const validateAdminRole = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    
    if(decoded.role === "admin") {
        next()
    } else {
        res.status(400).send('Access denied')
    }
}

module.exports = {validateToken, validateAdminRole};
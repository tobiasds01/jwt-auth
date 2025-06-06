const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    const token = req.headers['auth-token'];
    if (!token) return res.status(401).json({ error: 'Acceso denegado' })
    
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        next()
    } catch (error) {
        res.status(400).json({error: 'El token es inválido'})
    }
}

const validateAdminRole = (req, res, next) => {
    const token = req.headers['auth-token'];
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    
    if(decoded.role === "admin") {
        next()
    } else {
        res.status(400).send('Acceso denegado')
    }
}

module.exports = {validateToken, validateAdminRole};
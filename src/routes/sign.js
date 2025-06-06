var express = require('express');
var router = express.Router();

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const { v4: uuidv4 } = require('uuid');
const {User} = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get('/', function(req, res, next) {
  res.send('respond with a resources');
});

router.post('/register', async (req, res) => {
    try {
        const userExists = await User.findOne({where: {email: req.body.email}});

        if(userExists) {
            return res.status(400).send('Email ya registrado')
        } else {
            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash(req.body.password, salt);

            const user = User.create({
                id: uuidv4(),
                email: req.body.email,
                password: password,
                role: req.body.role
            }) 
            return res.status(201).send('Usuario registrado')
        }
    }
    catch (error) {
        return res.status(500).send(error)
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({where: {email: req.body.email}})
        if(!user) return res.status(404).send('Usuario no encontrado');
        
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if(!validPassword) return res.status(400).send('Contraseña incorrecta');
        
        const token = jwt.sign({
            email: user.email,
            role: user.role
        }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        
        return res.status(200).header('auth-token', token).json({
            error: null,
            data: {token}
        })
    }
    catch (error) {
        return res.status(500).send('La consulta falló')
    }
});

module.exports = router;
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


const auth = {
    login: async(email, password, secretKey) => {
        const user = await User.findOne({email})
        if(!user) return { error: 'Usuario o contraseña incorrecto' }
        const validPassword = await bcrypt.compare(password, user.password)
        if(!validPassword) return {error: 'Usuario o contraseña incorrectos'}
        const token = await jwt.sign({
            _id: user._id,
            name: user.name,
            date: user.date
        }, secretKey)
        return {message: 'login correcto', token}
    },
    checkHeaders: (req, res, next) => {
        const token = req.header('Authorization')
        if(!token){
            req.user = {auth: false}
            return next()
        }
        const jwtToken = token.split(' ')[1]
        if(!jwtToken){
            req.user = { auth: false }
            return next()
        }
        try {
            const payload = jwt.verify(jwtToken, process.env.SECRET_KEY_JWT_COURSE_API)
            req.user = payload
            req.user.auth = true
            return next()
        } catch (error) {
            req.user = {auth: false}
            return next()
        }
    }
}


module.exports = auth
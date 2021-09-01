const { Schema, model } = require('mongoose')

const userSchema = Schema({
    name: {
        type:String,
        required : [true,'The name is required'],
    },
    email: {
        type:String,
        required : [true,'The email is required'],
    },
    password: {
        type:String,
        required : [true,'The password is required'],
    },
    date: {
        type:String,
        required : [true,'The date is required'],
    }
})

const User = model('user', userSchema)

module.exports = User
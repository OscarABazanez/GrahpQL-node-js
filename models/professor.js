const { Schema, model } = require('mongoose')

const professorSchema = Schema({
    name: {
        type:String,
        required : [true,'The name is required'],
    },
    age: {
        type:Number,
        required : [true,'The age is required'],
    },
    active: {
        type:Boolean,
        required : [true,'The active is required'],
    },
    date: {
        type:String,
        required : [true,'The date is required'],
    }
})

const Professor = model('professor', professorSchema)

module.exports = Professor 
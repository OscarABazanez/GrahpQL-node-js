const { Schema, model } = require('mongoose')

const courseSchema = Schema({
    name: {type: String,
        required : [true,'The name is required'],
    },
    lenguaje: {type: String,
        required : [true,'The lenguaje is required'],
    },
    date: {type: String,
        required : [true,'The date is required'],
    },
    // professorId: String
    professorId: {
        type: Schema.Types.ObjectId,
        ref: 'Professor',
        required : [true,'The professorId is required'],
    }
})

const Course = model('course', courseSchema)

module.exports = Course
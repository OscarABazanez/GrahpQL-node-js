const graphql = require('graphql')
const {GraphQLObjectType, GraphQLID, GraphQLInt, GraphQLBoolean, GraphQLString, GraphQLList, GraphQLSchema} = graphql
const Course = require('../models/course')
const Professor = require('../models/professor')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const auth = require('../utils/auth')
const res = require('express/lib/response')

const CourseType = new GraphQLObjectType({
    name: 'Course',
    fields: ()=> ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        lenguaje: {type: GraphQLString},
        date: {type: GraphQLString},
        profesor: {
            type: ProfesorType,
            resolve(parent, args){
                return Professor.findById(parent.professorId)
            }
        }
    })
})

const ProfesorType = new GraphQLObjectType({
    name: 'Profesor',
    fields: ()=> ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        active: {type: GraphQLBoolean},
        date: {type: GraphQLString},
        course: {
            type: new GraphQLList(CourseType),
            resolve(parent, args){
                return Course.find({professorId: parent.id})
            }
        }
    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: ()=> ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        password: {type: GraphQLString},
        active: {type: GraphQLBoolean},
        date: {type: GraphQLString}
    })
})


const MessageType = new GraphQLObjectType({
    name: 'Message',
    fields: ()=>({
        message: {type: GraphQLString},
        token: {type: GraphQLString},
        error: {type: GraphQLString}
    })
})


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        course: {
            type: CourseType,
            args: {
                id: {type: GraphQLString}
            },
            resolve(parent, args, context){
                if(!context.user.auth){
                    throw new Error('Unauthenticated...')
                }
                return Course.findById(args.id)
            }
        },
        courses:{
            type: new GraphQLList(CourseType),
            resolve(parent,args){
                // return course
                return Course.find()
            }
        },
        profesor: {
            type: ProfesorType,
            args: {
                name: {type: GraphQLString}
            },
            resolve(parent, args, context){
                if(!context.user.auth){
                    throw new Error('Unauthenticated...')
                }
                return Professor.findOne({name: args.name})
            }
        },
        profesors:{
            type: new GraphQLList(ProfesorType),
            resolve(parent,args){
                return Professor.find()
            }
        },
        user: {
            type: UserType,
            args: {
                email: {type: GraphQLString}
            },
            resolve(parent, args, context){
                if(!context.user.auth){
                    throw new Error('Unauthenticated...')
                }
                return User.findById(args.id)
            }
        },
        users:{
            type: new GraphQLList(UserType),
            resolve(parent,args){
                return user
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addCourse: {
            type: CourseType,
            args: {
                name: {type: GraphQLString},
                lenguaje: {type: GraphQLString},
                date: {type: GraphQLString},
                professorId: {type: GraphQLID}
            },
            resolve(parent,args, context){
                if(!context.user.auth){
                    throw new Error('Unauthenticated...')
                }
                const { name, lenguaje, date, professorId} = args
                let course = new Course({
                    name,
                    lenguaje,
                    date,
                    professorId
                })
                return course.save()
            }
        },
        updateCourse: {
            type: CourseType,
            args: {
                id:{type: GraphQLID},
                name: {type: GraphQLString},
                lenguaje: {type: GraphQLString},
                date: {type: GraphQLString},
                professorId: {type: GraphQLID}
            },
            resolve(parent,args){
                const { id, name, date, lenguaje, professorId} = args
                return Course.findByIdAndUpdate(
                    id, {
                        name,
                        lenguaje,
                        date,
                        professorId
                    },{ new: true }
                )
            }
        },
        deleteCourse: {
            type: CourseType,
            args: {
                id:{type: GraphQLID}
            },
            resolve(parent,args){
                const { id } = args
                return Course.findByIdAndDelete(id)
            }
        },
        deleteAllCourses:{
            type: CourseType,
            resolve(parent, args){
                return Course.deleteMany({})
            }
        },
        addProfesor: {
            type: ProfesorType,
            args: {
                name: {type: GraphQLString},
                age: {type: GraphQLInt},
                active: {type: GraphQLBoolean},
                date: {type: GraphQLString}
            },
            resolve(parent,args){
                const { name, age, active, date} = args
                let professor = new Professor({
                    name,
                    age,
                    active,
                    date
                })
                return professor.save()
            }
        },
        updateProfesor: {
            type: ProfesorType,
            args: {
                id: {type: GraphQLID},
                name: {type: GraphQLString},
                age: {type: GraphQLInt},
                date: {type: GraphQLString}
            },
            resolve(parent,args){
                const { id, name, age, date} = args
                return Professor.findByIdAndUpdate(id,{
                    name, age, date
                },{ new:true })
            }
        },
        deleteProfesor: {
            type: ProfesorType,
            args: {
                id: {type: GraphQLID},
            },
            resolve(parent,args){
                const { id } = args
                return Professor.findByIdAndDelete(id)
            }
        },
        addUser: {
            type: MessageType,
            args:{
                name: {type: GraphQLString},
                email: {type: GraphQLString},
                password: {type: GraphQLString},
                date: {type: GraphQLString}
            },
            async resolve(parent, args){
                const { name, email, password, date } = args
                let user = await User.findOne({email})
                if(user) return {error: 'Usuario ya existe'}
                const salt = await bcrypt.genSalt(10)
                const passwordhas = await bcrypt.hash(password, salt)
                user = new User({
                    name,
                    email,
                    password:passwordhas,
                    date
                })
                user.save()
                return { message: 'Usuario registrado correctamente'}
            }
        },
        login: {
            type: MessageType,
            args: {
                email: {type: GraphQLString},
                password: {type: GraphQLString},
            },
            async resolve(parent, args){
                const { email, password } = args
                const { message, error, token } = await auth.login(email,password,process.env.SECRET_KEY_JWT_COURSE_API)
                return {
                    message,
                    error,
                    token
                }
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})
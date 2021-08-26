const graphql = require('graphql')
const {GraphQLObjectType, GraphQLID, GraphQLInt, GraphQLBoolean, GraphQLString, GraphQLList, GraphQLSchema} = graphql

var course = [
    {id:'1',name:'Padtrones de Java', lenguaje:'Java', date:'2022', profesorID:'2'},
    {id:'2',name:'Padtrones de Python', lenguaje:'Python', date:'2023', profesorID:'1'},
    {id:'3',name:'Padtrones de PHP', lenguaje:'PHP', date:'2024', profesorID:'1'},
    {id:'4',name:'Padtrones de JS', lenguaje:'JS', date:'2024', profesorID:'3'},
]
var profesor = [
    {id:'1',name:'Oscar', age:30, activo:true, date:'2022'},
    {id:'2',name:'Pedro', age:12, activo:false, date:'2023'},
    {id:'3',name:'Alfredo', age:30, activo:true, date:'2025'},
]
var user = [
    {id:'1',name:'Oscar', email:'a@gmail.com', password:"1234", activo:true, date:'2022'},
    {id:'2',name:'Pedro', email:'s@gmail.com', password:"64554", activo:false, date:'2011'},
    {id:'3',name:'Alejandra', email:'d@gmail.com', password:"1213234", activo:true, date:'2122'},
]

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
                return profesor.find(profesor => profesor.id === parent.profesorID)
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
        activo: {type: GraphQLBoolean},
        date: {type: GraphQLString},
        course: {
            type: new GraphQLList(CourseType),
            resolve(parent, args){
                return course.filter(course => course.profesorID === parent.id)
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
        activo: {type: GraphQLBoolean},
        date: {type: GraphQLString}
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

                return course.find(curso=> curso.id === args.id)
            }
        },
        courses:{
            type: new GraphQLList(CourseType),
            resolve(parent,args){
                return course
            }
        },
        profesor: {
            type: ProfesorType,
            args: {
                name: {type: GraphQLString}
            },
            resolve(parent, args, context){

                return profesor.find(profe=> profe.name === args.name)
            }
        },
        profesors:{
            type: new GraphQLList(ProfesorType),
            resolve(parent,args){
                return profesor
            }
        },
        user: {
            type: UserType,
            args: {
                email: {type: GraphQLString}
            },
            resolve(parent, args, context){

                return user.find(user=> user.email === args.email)
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


module.exports = new GraphQLSchema({
    query: RootQuery
})
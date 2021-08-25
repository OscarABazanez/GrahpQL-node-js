const graphql = require('graphql')
const {GraphQLObjectType, GraphQLID, GraphQLInt, GraphQLBoolean, GraphQLString, GraphQLList, GraphQLSchema} = graphql

var course = [
    {id:'1',name:'Padtrones de Java', lenguaje:'Java', date:'2022'},
    {id:'2',name:'Padtrones de Python', lenguaje:'Python', date:'2023'},
    {id:'3',name:'Padtrones de PHP', lenguaje:'PHP', date:'2024'},
]

const CourseType = new GraphQLObjectType({
    name: 'Course',
    fields: ()=> ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        lenguaje: {type: GraphQLString},
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
                // if(!context.user.auth){
                //     throw new Error('Unauthenticated...')
                // }
                // return Course.findById(args.id)
                return course.find(curso=> curso.id === args.id)
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery
})
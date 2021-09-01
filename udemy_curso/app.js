require('dotenv').config()
const express = require('express')
const graphqlHTTP = require('express-graphql')
const mongoose = require('mongoose');
const schema = require('./schema/schema');
const auth = require('./utils/auth');
const app = express()


mongoose.connect(process.env.MONGODB_CNN, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
.then(()=> console.log('Conectado a MongoDB correctamente'))
.catch(err => console.log('No se ha Conectado a MongoDB correctamente'))

app.use(auth.checkHeaders)


app.use('/graphql', graphqlHTTP((req)=>{
  return{
    schema,
    context:{
      user: req.user
    }
  }
}))


app.get('/', function (req, res) {
  res.send('Hello World')
})
 

app.listen(process.env.PORT, () => {
    console.log('Puerto',process.env.PORT)
})
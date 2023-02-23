const express = require('express')
const app = express()    //jaha bhi app. krke kush ho rha mtlb express call ho rha
var cors = require('cors')

app.use(cors())

const connectToMongo = require("./db")
connectToMongo();

const port = process.env.PORT || 5000;

app.use(express.json());

//Available Routes
app.use('/api/auth' , require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`iNotebook app listening on port ${port}`)
})

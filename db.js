const mongoose=require('mongoose');
mongoose.set('strictQuery', true)
//website to host: https://www.netlify.com/
//Atlas
const mongoURI='mongodb+srv://chilled:l4j8BRVOW130yweG@cluster0.opksu6u.mongodb.net/myKeep_app?retryWrites=true&w=majority'

//Localhost
// const mongoURI="mongodb://127.0.0.1:27017/inotebook1?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.0";

//Here inotebook1 is my database name .. 

const connectToMongo=()=>{
    mongoose.connect(mongoURI,()=>{    //mongoose.connect ek promise return krta hai
        console.log("connected to Mongo Successfully");
    })
}

module.exports=connectToMongo
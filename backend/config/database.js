const mongoose=require("mongoose");

const connectDB=()=>{
    mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        
    }).then((data)=>{
        console.log(`MongoDB connected with server: ${data.connection.host}`);
    });
}

module.exports=connectDB


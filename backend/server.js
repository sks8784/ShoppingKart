const app=require("./app");

const dotenv=require("dotenv");
const cloudinary=require("cloudinary");
const connectDB=require("./config/database");


//handling uncaught exception (due to use of undefined variables)
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
})

dotenv.config({path:"config/.env"});

connectDB();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

app.get("/",(req,res)=>{
    res.send("hello");
})

const server=app.listen(process.env.PORT,()=>{
    console.log(`server is running on http://localhost:${process.env.PORT}`);
})


//Unhandled promise rejection (due to wrong url of mongodb)
process.on("unhandledRejection",err=>{
    console.log(`Error:${err.message}`);
    console.log(`Shutting down the server due to unhandled promise rejection`);

    server.close(()=>{
        process.exit(1);
    });
});
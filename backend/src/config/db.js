//create database setup

const mongoose = require("mongoose");

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongoDb connected Successfully");
    }catch(err){
        console.log("Database Error--> ",err.message);
        process.exit(1);
    }
}
module.exports = connectDB;

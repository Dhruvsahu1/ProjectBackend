import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb = async()=>{
    try{
        const connectInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(` \n MongoDb connected successfully  !! DB HOST : ${connectInstance.connection.host}`);
        
    }catch(e){
        console.log("MongoDB Connection Error",e);
        process.exit(1);
    }
}

export default connectDb;
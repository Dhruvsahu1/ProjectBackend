import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    userName : {
        type : String,
        required : true,
        unique : true,
        lowerCase : true,
        trim : true,
        index : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowerCase : true,
        trim: true,
    },
    fullName : {
        type : String,
        required : true,
        trim : true,
        index : true,
    },
    avatar:{
        type : String, // Cloudinary Image URL
        required : true,
    },
    coverImage:{
        type : String, // Cloudinary Image URL
        required : true,
    },
    watchHistory :[
        {
            type : Schema.Types.ObjectId,
            ref : Video,
        }
    ],

    password : {
        type : String,
        required : [true , "Password is Required"],
    },
    refreshToken :{
        type : String,
    }

},{
    timestamps:true,
})

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10)
        next();
    }
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id: this.id,
        email:this.email,
        username:this.userName,
        fullname:this.fullName,
    },process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
}
userSchema.methods.generateRefreshToken = function(){
     return jwt.sign({
        _id: this.id,
    },process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}

export const user = mongoose.model("User",userSchema)
import mongoose from "mongoose";
import bcrypt, { compare } from "bcryptjs"

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,

    },
    email : {
        type : String, 
        required :  true,
        unique :  true,
        lowercase: true,
        trim: true,
    },
    username: {
        type :  String,
        required : true,
        unique : true,
        trim: true,
    },
    password: {
        type : String,
        required :true,
        minlength: 8,

    },
    avatar:{
        type: String,
        default : ""
    },
    bio: {
        type: String,
        default : "",
        maxlength : 160,
    },
    
        bookmarks: [{
            type : mongoose.Schema.Types.ObjectId,
            ref: "Poll"
                  
        }],
        following: [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }],
        isVerified: {
            type : Boolean,
            default : false,
        },
        otp : String,
        otpExpires: Date,
},
{
    timestamps : true,// auto add createdAt and updatedAt
});

// to hash the password before it saving
userSchema.pre("save", async function () {
     if (!this.isModified("password")) return ;
    this.password = await bcrypt.hash(this.password, 10);//10 = hashing strength / security level.
  
})

//to comapre the user password with the saved password
userSchema.methods.matchPassword = function(plain){
    return bcrypt.compare(plain, this.password); // This compares:plain password from login to hashed password from DB
}

const User =  mongoose.model("User", userSchema);
export default User;
// Schema blueprint hai, aur model usko actual database operations ke liye useable bana deta hai.
import mongoose, { Types } from "mongoose";
import Poll from "./Poll.js";
import User from "./User.js";

const commentShchema = new mongoose.Schema({
    poll:{
        type : mongoose.Schema.Types.ObjectId,
        ref: "Poll",
        required: true,
    },
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    parent:{
        type : mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default:null,
    },
    text:{
        type: String,
        required: true,
        trim: true,
    },
},{
    timestamps:true,
});
 const Comment = mongoose.model("Comment", commentShchema);
 export default Comment;

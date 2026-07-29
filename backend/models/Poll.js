import mongoose, { Schema } from "mongoose";
import User from "./User.js";

const voteSchema  =  new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required : true,
    },
    value : {
        type: Number,
        required : true,
    }
},{
    timestamps:true,
    _id : false,
});

// Poll Schema
 const pollSchema = new mongoose.Schema({
        creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true
    },
    question: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["single", "yesno", "rating", "image", "open"],
      required: true,
    },

    options: [{
      text: String,
      image: String
    }],
    category: {
      type: String,
      default: "General", trim: true
    },
    closed: {
      type: Boolean,
      default: false
    },
    views: {
      type: Number,
      default: 0
    },
    votes: [voteSchema],
 
 })

 export default mongoose.model("Poll" , pollSchema)
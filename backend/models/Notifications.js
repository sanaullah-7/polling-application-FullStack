
import mongoose from "mongoose";
import User from "./User.js";
import Poll from "./Poll.js";

const notificationSchema = new mongoose.Schema(
  {
    user: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: User, 
         required: true
         }, // owner of this notification

    actor: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: User,
         required: true 
        }, // who performed the action

    poll:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Poll,
    },
    type: {
      type: String,
      enum: ["follow", "vote", "comment", "bookmark", ],
      required: true,
    }, // notification kind
   
    read: { 
        type: Boolean,
         default: false 
        }, // read/unread flag
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

export default mongoose.model("Notification", notificationSchema);

import mongoose from "mongoose";

const { Schema } = mongoose;

const commentSchema = new Schema({
  body: {
    type: String,
    required: true,
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },

}, { timestamps: true });  

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;

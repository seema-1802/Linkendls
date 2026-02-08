import mongoose from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,  
    ref: "User",
    required: true,
  },

  body: {
    type: String,
    required: true,
    maxlength: 1000,  
  },

  media: [
    {
      url: { type: String },
      fileType: { type: String, enum: ['image', 'video', 'audio', 'other'], default: 'image' }
    }
  ],

  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",  
    }
  ],

  active: {
    type: Boolean,
    default: true,  
  },

}, { timestamps: true });  

const Post = mongoose.model("Post", postSchema);

export default Post;

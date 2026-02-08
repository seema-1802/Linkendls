import mongoose from "mongoose";

const { Schema } = mongoose;

const connectionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  connectId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  }
}, { timestamps: true });

const Connection = mongoose.model("Connection", connectionSchema);

export default Connection;

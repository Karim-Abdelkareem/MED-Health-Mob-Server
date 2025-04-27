// models/messageModel.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    senderRole: String,
    message: String,
    channel: String,
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);

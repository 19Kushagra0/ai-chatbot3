import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    role: String, // who sent it: "user" or "ai"
    text: String, // the actual message content
  },
  { timestamps: true }
);

export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema);

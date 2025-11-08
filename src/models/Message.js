import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    message: { type: String, required: true, trim: true },
    seen: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Speed query index
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: 1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;

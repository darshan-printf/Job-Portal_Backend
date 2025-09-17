import mongoose from "mongoose";

const InboxSchema = new mongoose.Schema({
   name: { type: String, required: true },
   email: { type: String, required: true },
   message: { type: String, required: true },
   subject: { type: String, required: true },
   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date, default: Date.now },
});

const Inbox = mongoose.model("Inbox", InboxSchema);

export default Inbox;

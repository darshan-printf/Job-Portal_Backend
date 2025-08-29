import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
   name: { type: String, required: true },
   description: { type: String, required: true },
   designation: { type: String, required: true },
   image: { type: String, required: true },
   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date, default: Date.now },
});

const Team = mongoose.model("Team", TeamSchema);

export default Team;

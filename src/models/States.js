import mongoose from "mongoose";

const { Schema, model } = mongoose;

const StateSchema = new Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    country: { type: Schema.Types.ObjectId, ref: 'Country', required: true }
}, { timestamps: true });

const State = model("State", StateSchema);

export default State;

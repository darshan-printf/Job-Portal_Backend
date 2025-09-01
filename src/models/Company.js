import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  website: { type: String, required: true },
  logo: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  GSTNumber: { type: String, required: true },
  PANNumber: { type: String, required: true },
  CINNumber: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  type: { type: String, required: true },
});

const Company = mongoose.model("Company", companySchema);

export default Company;

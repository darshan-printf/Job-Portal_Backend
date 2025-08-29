import mongoose from "mongoose";

const PackageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  version: { type: String, required: true },
  description: { type: String, required: true },
  main: { type: String, required: true },
  scripts: { type: Object, required: true },
  keywords: { type: [String], required: true },
  author: { type: String, required: true },
  license: { type: String, required: true },
  dependencies: { type: Object, required: true },
  devDependencies: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Package = mongoose.model("Package", PackageSchema);

export default Package;

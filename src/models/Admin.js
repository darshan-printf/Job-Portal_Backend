import mongoose from "mongoose";

// Connect to MongoDB

const adminSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username:{ type: String, required: true, unique: true },
    password: { type: String, required: true },
    instituteName: { type: String, required: true },
    role: { type: String, default: 'admin' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
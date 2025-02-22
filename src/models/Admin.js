import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    instituteName: { type: String, required: true },
    
    role: { 
        type: String, 
        enum: ['admin', 'user'], // Only "admin" and "user" allowed
        default: 'admin' 
    },

    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;

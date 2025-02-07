import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        instituteName: { type: String, required: true },
        role: { type: String, default: 'user' },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);


const User = mongoose.model('User', userSchema);
export default User;

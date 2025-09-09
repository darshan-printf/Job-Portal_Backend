import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    email: { type: String, required: false, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    instituteName: { type: String, required: false },
    profileImage: { type: String },
    logo: { type: String },

    role: {
      type: String,
      enum: ["admin", "user"], // Only "admin" and "user" allowed
      default: "admin",
    },

    isActive: { type: Boolean, default: false },

    // Company reference
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: function () {
        return this.role === "user"; // Required only if role is "user"
      },
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;

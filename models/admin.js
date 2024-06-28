import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: true, // Admins are true by default
    },
    // Add any other fields specific to admins
}, { timestamps: true });

const Admin = mongoose.model("Admin", AdminSchema);

export default Admin;

import mongoose from "mongoose";


const AdminInstance = new mongoose.Schema({
    
    username: {
        type: String,
        required: true,
    },
    
    password: {
        type: String,
        required: true,
    },
    movies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Todo'
        }
    ]
},
{ timestamps: true }
);

const Admin = mongoose.model("Admin", AdminInstance);

export default Admin;

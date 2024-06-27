import mongoose from "mongoose";
//import { Todo } from "./todo.js"; 

const UserInstance = new mongoose.Schema({
    
    username: {
        type: String,
        required: true,
    },
    
    password: {
        type: String,
        required: true,
    },
    todos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Todo'
        }
    ]
},
{ timestamps: true }
);

const User = mongoose.model("User", UserInstance);

export default User;

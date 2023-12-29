const mongoose = require("mongoose");


const {ObjectId} = mongoose.Schema;

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        trim: true,
        text: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],    
    },  
    admin:{
        type: Boolean,
        default: false
    }
    
}, {
    timestamps:true,
});


module.exports = mongoose.model('User', userSchema)
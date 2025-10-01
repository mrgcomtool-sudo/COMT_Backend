const mongoose = require("mongoose");

const memberSchema = mongoose.Schema({
    name:{
        type:String,
    },
    dateOfBirth:{
        type:Date
    },
    personalEmail:{
        type:String,
    },
    photoUrl:{
        type:String,
    },
    phone:{
        type:String,
    },
    maritalStatus:{
        type:String,
    },
    address:{
        type:String,
    },
    role:{
        type:String,
    },
    skills:[{
        type:String
    }],
    image:{
        type:String
    }
        
    
},{timestamps:true})

module.exports = mongoose.model("Member",memberSchema);
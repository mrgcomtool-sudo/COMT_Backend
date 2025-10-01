const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
    
    name:{
        type:String,
    },
    description:{
        type:String,
    },
   
   email:{
        type:String,
    },
    phone:{
        type:String,
    },
    address:{
        type:String,
    },
  
        
    
},{timestamps:true})

module.exports = mongoose.model("Client",clientSchema);
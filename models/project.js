const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
     typeId: {
    type: String,
    
    },
    name:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    location:{
        type:String,
        
    },
    startDate:{
        type:Date,
        required:true,
    },
    endDate:{
        type:Date,
       
    },
    status:{
        type:String,
        required:true
    },
    clientId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
       // required: true
    },
    projectManager:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
       // required: true
    }
},{timestamps:true})

module.exports = mongoose.model("Project",projectSchema)
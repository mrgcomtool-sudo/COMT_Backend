const mongoose = require("mongoose");

const phaseSchema = mongoose.Schema({
    customId: {
    type: String,
    unique: true,
    },
    name:{
        type:String,
        required:true
    },
    description:{
        type:String
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
    
    projectId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },

},{timestamps:true})

module.exports = mongoose.model("Phase",phaseSchema)
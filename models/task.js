const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
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
    budget:{
        type:Number,  
    },
    assignedTo:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
        required: true
    }],
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },
   
    phaseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Phase",
        required: true
    }
},{timestamps:true})

module.exports = mongoose.model("Task",taskSchema)
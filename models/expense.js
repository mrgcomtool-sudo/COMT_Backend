const mongoose = require("mongoose");

const expenseSchema = mongoose.Schema({
    customId:{
        type:String,
        required:true
    },
     projectId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Project",
            required:true
        },
       
        phaseId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Phase",
            required: true
        },
        taskId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Task",
            required:true
        },
         name:{
            type:String,
            required:true
        },
        description:{
            type:String,
            
        },
        category:{
            type:String,
            
        },
        amount:{
            type:Number,
            required:true,
        },
        paidTo:{
            type:String
        },
        paymentDate:{
            type:Date
        },
        paymentMethod:{
            type:String
        },
        transactionNo:{
            type:String
        }
    

},{timestamps:true})

module.exports = mongoose.model("Expense",expenseSchema);
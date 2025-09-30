const mongoose = require("mongoose");

const incomeSchema = mongoose.Schema({
    customId:{
        type:String,
        required:true
    },
     projectId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Project",
            required:true
        },
       
        // phaseId:{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "Phase",
          
        // },
        name:{
            type:String,
            required:true
        },
        description:{
            type:String,
            
        },
       
        amount:{
            type:Number,
            required:true,
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

module.exports = mongoose.model("Income",incomeSchema);
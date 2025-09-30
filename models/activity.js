const mongoose= require('mongoose');

const activitySchema = new mongoose.Schema(
    {
        type:{
            type:String,
            enum:['PROJECT','TASK','PHASE','MEMBER','EXPENSE','USER','CLIENT','INCOME'],
            required:true,
        },
        action:{
            type:String,
            required:true,
        },
        meta:{
            type:Object,
            required:true,
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Activity",activitySchema);

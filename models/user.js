const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  customId: {type:String,required:true},
  memberId: { type: mongoose.Schema.Types.ObjectId,ref:"Member" },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Member"], default: "Member" },
},{timestamps:true});

module.exports = mongoose.model("User", userSchema);

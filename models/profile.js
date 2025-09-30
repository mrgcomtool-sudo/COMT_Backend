const mongoose = require("mongoose");
const profileSchema = new mongoose.Schema({
  image: { type: String},
  name: { type: String, required: true },
  public_id:{ type:String },
},{timestamps:true});

module.exports = mongoose.model("Profile",profileSchema);

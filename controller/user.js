const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Activity = require("../models/activity");
const Member = require("../models/member");

// Helper to format ID like P00001
const generateCustomId = async () => {
  const lastUser = await User.findOne({ customId: { $exists: true } })
    .sort({ createdAt: -1 }) // newest project first
    .select("customId");

  let newNumber = 1;
  if (lastUser && lastUser.customId) {
    const lastNumber = parseInt(lastUser.customId.replace("U", ""));
    newNumber = lastNumber + 1;
  }

  return `U${newNumber.toString().padStart(5, "0")}`;
};


//Register new user
const register = async(req,res)=>{
  const {memberId,username,password,role} = req.body;
  if (!username || !password) {
        return res.status(400).json({ message: "username and password is required" })
    }
  try{
    let user = await User.findOne({username});
    if(user){
      return res.status(400).json({error:"Username is already exist"})
    }
    const hashPwd = await bcrypt.hash(password, 10)
    const customId = await generateCustomId();
    const newUser = await User.create({customId,memberId,username,password:hashPwd,role});
    const member = await Member.findById(memberId);
   
     await Activity.create({
              type: 'USER',
              action: 'created',
              meta: {
                username, // username
                memberName: member.name, // member names
              },
              targetId: newUser._id,
            });
  
          res.status(201).json({message:"User added successfully",user:newUser});
          }catch(err){
              console.error("Error adding User:",err);
              res.status(500).json({message:"Server Error",error:err.message});
          }

}



//login
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch )
      return res.status(400).json({ message: "Invalid Password" });

    const token = jwt.sign({ userId: user._id, role: user.role, memberId: user.memberId }, process.env.SECRET_KEY, {
      expiresIn: "2h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 2 * 60 * 60 * 1000,
    }).json({ message: "Login successful",success: true,user: { role: user.role, username: user.username,memberId:user.memberId }} );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const getAllUser = async(req,res)=>{
    const users = await User.find().populate("memberId","name photoUrl")
    return res.json(users);
}

 //logout
const logOut= (req, res) => {
  res.clearCookie("token", {
  httpOnly: true,
  secure: true,
  sameSite: "None",
}).json({ message: "Logged out" });
}

//check
const check= async (req, res) => {
  res.json({ userId: req.user.userId, role: req.user.role,memberId: req.user.memberId });
}

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete User", error: error.message });
  }
};
module.exports ={login,logOut,check,register,getAllUser,deleteUser}

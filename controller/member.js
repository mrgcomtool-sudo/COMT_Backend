const Member = require("../models/member");
const Activity = require("../models/activity");
const { uploadToDrive } = require("../utils/googleDrive");

// Helper to format ID like M00001
const generateCustomId = async () => {
  const lastMember = await Member.findOne({ customId: { $exists: true } })
    .sort({ createdAt: -1 }) // newest member first
    .select("customId");

  let newNumber = 1;
  if (lastMember && lastMember.customId) {
    const lastNumber = parseInt(lastMember.customId.replace("M", ""));
    newNumber = lastNumber + 1;
  }

  return `M${newNumber.toString().padStart(5, "0")}`;
};


//  Get all members
const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ message: "Server error fetching members" });
  }
};

//  Get a single member by ID
const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json(member);
  } catch (error) {
    console.error("Error fetching member:", error);
    res.status(500).json({ message: "Server error fetching member" });
  }
};

// ✅ Update member by ID
const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, personalEmail, dateOfBirth,phone,role,skills,address,maritalStatus} = req.body;

    const updatedMember = await Member.findByIdAndUpdate(id,{  name, personalEmail, dateOfBirth,phone,role,skills,address,maritalStatus} ,
      { new: true, // returns updated document
        runValidators: true, // applies schema validations
      });

    if (!updatedMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json(updatedMember);
  } catch (error) {
    console.error("Error updating member:", error);
    res.status(500).json({ message: "Server error updating member" });
  }
};

/*********Delete Project */
const deleteMember=async (req, res) => {
  try {
   
    const deleted = await Member.findByIdAndDelete(req.params.id);
    if (!deleted) {
       
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
   
    res.status(400).json({ message: "Invalid Member ID", error });
  }
}

/*********Add New Member */
const addMember3 = async(req,res)=>{
    try{
        const { name, personalEmail, dateOfBirth,phone,role,skills,address,maritalStatus}=req.body;
        if(!name){
            return res.status(400).json({message:"Project title is required"});
        }
        
        const newMember = await Member.create({name, personalEmail, dateOfBirth,phone,role,skills,address,maritalStatus});  
        await Activity.create({
            type: 'MEMBER',
            action: 'joined',
            meta: {
              name,
            },
            targetId: newMember._id,
        })
    res.json({ message: "✅ Member added successfully", member:newMember });
        }catch(err){
            console.error("Error adding Member:",err);
            res.status(500).json({message:"Server Error",error:err.message});
        }
    
    }

/*********Add New member with image */
const addMember2 = async(req,res)=>{
    try{
        const { name, personalEmail, dateOfBirth,phone,role,skills,address,maritalStatus}=req.body;
        if(!name){
            return res.status(400).json({message:"Name is required"});
        }
         let imageLink = "";
          if (req.file) {
            imageLink = await uploadToDrive(req.file.path, req.file.originalname, req.file.mimetype);
          }

        const customId = await generateCustomId();
        const newMember = await Member.create({customId,name, personalEmail, dateOfBirth,phone,role,skills,address,maritalStatus,image: imageLink});
        await Activity.create({
            type: 'MEMBER',
            action: 'joined',
            meta: {
              name,
            },
            targetId: newMember._id,
        })
    res.json({ message: "✅ Member added successfully", member:newMember });
        }catch(err){
            console.error("Error adding Member:",err);
            res.status(500).json({message:"Server Error",error:err.message});
        }
    }


module.exports={getAllMembers,getMemberById,updateMember,deleteMember,addMember2,addMember3}
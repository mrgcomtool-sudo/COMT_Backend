const Activity = require("../models/activity");
const Project = require("../models/project");
const Client = require("../models/client");

/**********Get All Projects */
/********** Get All Projects **********/
const getProjectList = async (req, res) => {
  try {
    const projectList = await Project.find()
      .populate("projectManager", "name") // you can include more fields if needed
      .populate("clientId", "name");

    return res.status(200).json(projectList);
  } catch (error) {
    console.error("Error fetching project list:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch projects",
      error: error.message,
    });
  }
};



// Helper to format ID like P00001
const generateCustomId = async () => {
  const lastProject = await Project.findOne({ customId: { $exists: true } })
    .sort({ createdAt: -1 }) // newest project first
    .select("customId");

  let newNumber = 1;
  if (lastProject && lastProject.customId) {
    const lastNumber = parseInt(lastProject.customId.replace("P", ""));
    newNumber = lastNumber + 1;
  }

  return `P${newNumber.toString().padStart(5, "0")}`;
};


/*********Add New Project */
const addProject = async(req,res)=>{
    try{
        const {typeId, name, description, location,startDate, endDate, status, clientId,projectManager}=req.body;
        if(!name){
            return res.status(400).json({message:"Project title is required"});
        }
        
        const newProject = await Project.create({name,typeId, description, location,startDate, endDate, status, clientId,projectManager});
        const client = await Client.findById(clientId);
        await Activity.create({
            type: 'PROJECT',
            action: 'created',
            meta: {
              name, // project name
              clientName:client.name
            },
            targetId: newProject._id,
          });

        res.status(201).json({message:"Project added successfully",project:newProject,});
        }catch(err){
            console.error("Error adding Project:",err);
            res.status(500).json({message:"Server Error",error:err.message});
        }
    }

/*********Update Project */
const editProject=async(req,res)=>{
    const {name,typeId, description, location,startDate, endDate, status, clientId,projectManager}=req.body 
    try{
  
           const updated= await Project.findByIdAndUpdate(req.params.id,{name,typeId, description, location,startDate, endDate, status, clientId,projectManager},{new:true})
            res.status(201).json({message:"Project updated successfully",project:updated,});
        }
    
    catch(err){
        return res.status(404).json({message:err})
    }
    
}

/*********Delete Project */
const deleteProject=async (req, res) => {
  try {
   
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) {
       
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
   
    res.status(400).json({ message: "Invalid project ID", error });
  }
}



module.exports={addProject,getProjectList,deleteProject,editProject}
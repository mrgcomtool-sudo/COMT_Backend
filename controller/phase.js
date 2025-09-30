const Activity = require("../models/activity");
const Project = require("../models/project");
const Phase = require("../models/phase")


// Helper to format ID like T00001
const generateCustomId = async () => {
  const lastPhase = await Phase.findOne({ customId: { $exists: true } })
    .sort({ createdAt: -1 }) // newest Phase first
    .select("customId");

  let newNumber = 1;
  if (lastPhase && lastPhase.customId) {
    const lastNumber = parseInt(lastPhase.customId.replace("PH", ""));
    newNumber = lastNumber + 1;
  }

  return `PH${newNumber.toString().padStart(5, "0")}`;
};

// ✅ Create Phase
const createPhase = async (req, res) => {
  try {
    const {  name, description,startDate, endDate, status, projectId } = req.body;
    const customId = await generateCustomId();
    const newPhase = new Phase({customId, name, description,startDate, endDate, status,projectId});

    const savedPhase = await newPhase.save();
    const project = await Project.findById(projectId);
    await Activity.create({
        type: 'PHASE',
        action: 'created',
        meta: {
          name,        // phase name
          projectName: project.name // Project name
        },
        targetId: savedPhase._id,
      });
    res.status(201).json({ success: true, message: "Phase created successfully", data: savedPhase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create Phase", error: error.message });
  }
};

// ✅ Get All Phases
const getAllPhases = async (req, res) => {
  try {
    const phases = await Phase.find().populate("projectId", "name"); // populate project name
    res.status(200).json({ success: true, data: phases });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch phases", error: error.message });
  }
};

// ✅ Update Phase
 const updatePhase = async (req, res) => {
  try {
    const updatedPhase = await Phase.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedPhase) {
      return res.status(404).json({ success: false, message: "Phase not found" });
    }

    res.status(200).json({ success: true, message: "Phase updated successfully", data: updatedPhase });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update phase", error: error.message });
  }
};

// ✅ Delete Phase
const deletePhase = async (req, res) => {
  try {
    const deletedPhase = await Phase.findByIdAndDelete(req.params.id);

    if (!deletedPhase) {
      return res.status(404).json({ success: false, message: "Phase not found" });
    }

    res.status(200).json({ success: true, message: "Phase deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete phase", error: error.message });
  }
};

module.exports={createPhase,getAllPhases,updatePhase,deletePhase}
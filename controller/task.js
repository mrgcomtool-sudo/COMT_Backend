const Task = require("../models/task");
const Activity = require("../models/activity");
const Phase = require("../models/phase");
const Member =require('../models/member');

// Helper to format ID like S00001
const generateCustomId = async () => {
  const lastTask = await Task.findOne({ customId: { $exists: true } })
    .sort({ createdAt: -1 }) // newest project first
    .select("customId");

  let newNumber = 1;
  if (lastTask && lastTask.customId) {
    const lastNumber = parseInt(lastTask.customId.replace("T", ""));
    newNumber = lastNumber + 1;
  }

  return `T${newNumber.toString().padStart(5, "0")}`;
};
// ✅ Create Task
const createTask = async (req, res) => {
  try {
    const { name, description,startDate, endDate, status, budget,projectId, assignedTo, phaseId } = req.body;
    const customId = await generateCustomId();
    const newTask = new Task({ customId,  name, description,startDate, endDate, status, budget,projectId, assignedTo, phaseId });

    const savedTask = await newTask.save();
    const phase = await Phase.findById(phaseId);
    const members = await Member.find({_id:{$in:assignedTo}});

    await Activity.create({
        type: 'TASK',
        action: 'created',
        meta: {
          name,            
          phaseName: phase.name,  // Phase name
          memberNames: members.map(m => m.name)  // array of names
        },
        targetId: savedTask._id,
      });
    res.status(201).json({ success: true, message: "Task created successfully", data: savedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create Task", error: error.message });
  }
};

// ✅ Get All Tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email photoUrl")  // populate member info
      //.populate({path:"taskId",select:"title projectId ",populate:{ path: 'projectId', select:'title'}})
      .populate("projectId","name")
      .populate("phaseId","name")
      
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch Tasks", error: error.message });
  }
};

// ✅ Update Task
const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, message: "Task updated successfully", data: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update Task", error: error.message });
  }
};

// ✅ Delete Task
const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete Task", error: error.message });
  }
};


module.exports={createTask,getAllTasks,updateTask,deleteTask}
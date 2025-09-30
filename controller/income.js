const Project = require("../models/project");
const Activity = require("../models/activity");
const Income = require("../models/income");

// Helper to format ID like S00001
const generateCustomId = async () => {
  const lastIncome = await Income.findOne({ customId: { $exists: true } })
    .sort({ createdAt: -1 }) // newest project first
    .select("customId");

  let newNumber = 1;
  if (lastIncome && lastIncome.customId) {
    const lastNumber = parseInt(lastIncome.customId.replace("IN", ""));
    newNumber = lastNumber + 1;
  }

  return `IN${newNumber.toString().padStart(5, "0")}`;
};
// ✅ Create Income
const createIncome = async (req, res) => {
  try {
    const { projectId,name,description,amount,paymentDate,paymentMethod,transactionNo } = req.body;
    const customId = await generateCustomId();
    const newIncome = new Income({ customId,projectId,name,description,amount,paymentDate,paymentMethod,transactionNo });

    const savedIncome = await newIncome.save();
    const project = await Project.findById(projectId);


    await Activity.create({
        type: 'INCOME',
        action: 'created',
        meta: {
          name,
          description,
          amount,
          paymentDate,
          paymentMethod,            
          projectName:project.name,
        },
        targetId: savedIncome._id,
      });
    res.status(201).json({ success: true, message: "Income created successfully", data: savedIncome });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create Income", error: error.message });
  }
};

// ✅ Get All Incomes
const getAllIncomes = async (req, res) => {
  try {
    const incomes = await Income.find()
      //.populate({path:"phaseId",select:"title projectId ",populate:{ path: 'projectId', select:'title'}})
      .populate("projectId","name")
      // .populate("phaseId","name")
      
      
    res.status(200).json({ success: true, data: incomes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch Incomes", error: error.message });
  }
};

// ✅ Update Income
const updateIncome = async (req, res) => {
  try {
    const updatedIncome = await Income.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedIncome) {
      return res.status(404).json({ success: false, message: "Income not found" });
    }

    res.status(200).json({ success: true, message: "Income updated successfully", data: updatedIncome });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update Income", error: error.message });
  }
};

// ✅ Delete Income
const deleteIncome = async (req, res) => {
  try {
    const deletedIncome = await Income.findByIdAndDelete(req.params.id);

    if (!deletedIncome) {
      return res.status(404).json({ success: false, message: "Income not found" });
    }

    res.status(200).json({ success: true, message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete Income", error: error.message });
  }
};


module.exports={createIncome,getAllIncomes,updateIncome,deleteIncome}
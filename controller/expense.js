const Task = require("../models/task");
const Activity = require("../models/activity");
const Expense = require("../models/expense");

// Helper to format ID like S00001
const generateCustomId = async () => {
  const lastExpense = await Expense.findOne({ customId: { $exists: true } })
    .sort({ createdAt: -1 }) // newest project first
    .select("customId");

  let newNumber = 1;
  if (lastExpense && lastExpense.customId) {
    const lastNumber = parseInt(lastExpense.customId.replace("EX", ""));
    newNumber = lastNumber + 1;
  }

  return `EX${newNumber.toString().padStart(5, "0")}`;
};
// ✅ Create Expense
const createExpense = async (req, res) => {
  try {
    const { projectId,phaseId,taskId,name,description,category,amount, paidTo,paymentDate,paymentMethod,transactionNo,workers,
   salary, food, quantity, price,miscellaneous, unit } = req.body;
    const customId = await generateCustomId();
    const newExpense = new Expense({ customId,projectId,phaseId,taskId,name,description,category,amount, paidTo,paymentDate,paymentMethod,transactionNo,
      workers, salary, food, quantity, price,miscellaneous, unit
     });

    const savedExpense = await newExpense.save();
    const task = await Task.findById(taskId);


    await Activity.create({
        type: 'EXPENSE',
        action: 'created',
        meta: {
          name,
          description,
          paidTo,
          amount,
          paymentDate,
          paymentMethod,            
          taskName:task.name,
        },
        targetId: savedExpense._id,
      });
    res.status(201).json({ success: true, message: "Expense created successfully", data: savedExpense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create Expense", error: error.message });
  }
};

// ✅ Get All Expenses
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find()
      //.populate({path:"taskId",select:"title projectId ",populate:{ path: 'projectId', select:'title'}})
      .populate("projectId","name")
      .populate("phaseId","name")
      .populate("taskId","name")
      
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch Expenses", error: error.message });
  }
};

// ✅ Update Expense
const updateExpense = async (req, res) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    res.status(200).json({ success: true, message: "Expense updated successfully", data: updatedExpense });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update Expense", error: error.message });
  }
};

// ✅ Delete Expense
const deleteExpense = async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);

    if (!deletedExpense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    res.status(200).json({ success: true, message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete Expense", error: error.message });
  }
};


module.exports={createExpense,getAllExpenses,updateExpense,deleteExpense}
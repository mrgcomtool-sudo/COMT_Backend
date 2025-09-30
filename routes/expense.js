const express = require("express");
const router = express.Router();
const {createExpense,getAllExpenses,updateExpense,deleteExpense}= require("../controller/expense");
const verifyToken = require('../middleware/auth')


// CRUD routes
router.post("/",verifyToken, createExpense);
router.get("/",verifyToken, getAllExpenses);
router.put("/:id",verifyToken , updateExpense);
router.delete("/:id",verifyToken , deleteExpense);

module.exports = router;

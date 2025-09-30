const express = require("express");
const router = express.Router();
const {createIncome,getAllIncomes,updateIncome,deleteIncome}= require("../controller/income");
const verifyToken = require('../middleware/auth')


// CRUD routes
router.post("/",verifyToken, createIncome);
router.get("/",verifyToken, getAllIncomes);
router.put("/:id",verifyToken, updateIncome);
router.delete("/:id",verifyToken, deleteIncome);

module.exports = router;

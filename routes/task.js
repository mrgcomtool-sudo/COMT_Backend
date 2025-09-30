const express = require("express");
const router = express.Router();
const {createTask,getAllTasks,updateTask,deleteTask}= require("../controller/task");
const verifyToken = require('../middleware/auth')
const authorizeRoles = require('../middleware/authorize')

// CRUD routes
router.post("/",verifyToken,authorizeRoles('Admin') , createTask);
router.get("/",verifyToken, getAllTasks);
router.put("/:id",verifyToken,authorizeRoles('Admin') , updateTask);
router.delete("/:id",verifyToken,authorizeRoles('Admin') , deleteTask);

module.exports = router;

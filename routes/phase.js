
const express = require("express");
const router = express.Router();
const {createPhase,getAllPhases,getPhaseById,updatePhase,deletePhase} = require("../controller/phase");
const verifyToken = require('../middleware/auth')
const authorizeRoles = require('../middleware/authorize')

// CRUD routes
router.post("/",verifyToken,authorizeRoles('Admin') , createPhase);
router.get("/",verifyToken , getAllPhases);
router.put("/:id",verifyToken,authorizeRoles('Admin') ,updatePhase);
router.delete("/:id",verifyToken,authorizeRoles('Admin') , deletePhase);

module.exports = router;

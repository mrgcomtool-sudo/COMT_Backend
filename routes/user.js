const express = require('express');
const router=express.Router();
const {login,logOut, check,register,getAllUser,deleteUser} = require("../controller/user");
const verifyToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorize')

router.post("/login",login);
router.post("/logout",logOut);
router.get("/check",verifyToken,check);
router.post("/register",verifyToken,authorizeRoles('Admin'),register);
router.get("/getUser",getAllUser);
router.delete("/:id",verifyToken,authorizeRoles('Admin') , deleteUser);

module.exports= router;
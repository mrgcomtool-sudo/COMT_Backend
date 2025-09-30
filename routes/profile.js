const express=require("express")
const{ getProfile,saveProfile,upload}=require("../controller/profile")
const verifyToken = require('../middleware/auth')
const authorizeRoles = require('../middleware/authorize')
const router=express.Router()

router.get("/",getProfile) 
router.post("/",upload.single('file'),verifyToken, authorizeRoles('Admin'),saveProfile)// add or edit profile


module.exports=router
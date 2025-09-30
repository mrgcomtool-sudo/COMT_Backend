const express = require("express");
const {getAllMembers,getMemberById,updateMember,deleteMember,addMember, addMember2,addMember3} = require("../controller/member");
const verifyToken = require('../middleware/auth')
const authorizeRoles = require('../middleware/authorize')
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/",verifyToken, getAllMembers);       // GET all members
router.get("/:id",verifyToken, getMemberById);    // GET single member
//router.post('/add', addMember);    //add Member from sheet
router.post('/',upload.single("image"),verifyToken,authorizeRoles('Admin') , addMember2);    //add Member from Webapp with image
router.post('/add',verifyToken,authorizeRoles('Admin') , addMember3);    //add Member from webapp
router.patch("/:id",verifyToken,authorizeRoles('Admin') , updateMember);     // UPDATE member
router.delete("/:id",verifyToken,authorizeRoles('Admin') ,deleteMember) //delete Member

module.exports = router;

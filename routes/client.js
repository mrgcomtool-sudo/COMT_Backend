const express = require("express");
const {getAllClients,getClientById,updateClient,deleteClient,addClient} = require("../controller/client");
const verifyToken = require('../middleware/auth')
const authorizeRoles = require('../middleware/authorize')
const router = express.Router();


router.get("/",verifyToken, getAllClients);       // GET all clients
router.get("/:id",verifyToken, getClientById);    // GET single client
router.post('/',verifyToken,authorizeRoles('Admin') , addClient);    //add Client from webapp
router.put("/:id",verifyToken,authorizeRoles('Admin') , updateClient);     // UPDATE client
router.delete("/:id",verifyToken,authorizeRoles('Admin') ,deleteClient) //delete Client

module.exports = router;

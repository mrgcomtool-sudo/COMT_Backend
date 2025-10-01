const Client = require("../models/client");
const Activity = require("../models/activity");


// Helper to format ID like M00001
const generateCustomId = async () => {
  const lastClient = await Client.findOne({ customId: { $exists: true } })
    .sort({ createdAt: -1 }) // newest client first
    .select("customId");

  let newNumber = 1;
  if (lastClient && lastClient.customId) {
    const lastNumber = parseInt(lastClient.customId.replace("C", ""));
    newNumber = lastNumber + 1;
  }

  return `C${newNumber.toString().padStart(5, "0")}`;
};


//  Get all clients
const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ message: "Server error fetching clients" });
  }
};

//  Get a single client by ID
const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json(client);
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({ message: "Server error fetching client" });
  }
};

// ✅ Update client by ID
const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const {name, email, phone,address,description} = req.body;

    const updatedClient = await Client.findByIdAndUpdate(id,{ name, email, phone,address,description} ,
      { new: true, // returns updated document
        runValidators: true, // applies schema validations
      });

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json({client:updatedClient});
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).json({ message: "Server error updating client" });
  }
};

/*********Delete Project */
const deleteClient=async (req, res) => {
  try {
   
    const deleted = await Client.findByIdAndDelete(req.params.id);
    if (!deleted) {
       
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
   
    res.status(400).json({ message: "Invalid project ID", error });
  }
}

/*********Add New Client */
const addClient = async(req,res)=>{
    try{
        const { name, email, phone,address,description}=req.body;
        if(!name){
            return res.status(400).json({message:"Project title is required"});
        }
        
        const newClient = await Client.create({name, email, phone,address,description});  
        await Activity.create({
            type: 'CLIENT',
            action: 'added',
            meta: {
              name,
            },
            targetId: newClient._id,
        })
    res.json({ message: "✅ Client added successfully", client:newClient });
        }catch(err){
            console.error("Error adding Client:",err);
            res.status(500).json({message:"Server Error",error:err.message});
        }
    
    }

module.exports={getAllClients,getClientById,updateClient,deleteClient,addClient}
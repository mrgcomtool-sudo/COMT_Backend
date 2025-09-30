const Profile = require('../models/profile');
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const storage = require("../config/storage");
  const upload = multer({ storage });

  const getProfile=async(req,res)=>{
      try {
       const profile=await Profile.findOne()
    
        return res.status(200).json(profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({
          success: false,
          message: "Server Error: Unable to fetch profile",
          error: error.message,
        });
      }
}


// CREATE or UPDATE profile (only one record allowed)
const saveProfile = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Business name is required" });
    }

    // find existing profile
    let profile = await Profile.findOne();

    let image = profile?.image || "";
    let public_id = profile?.public_id || "";

    // if new file uploaded → replace on cloudinary
    if (req.file) {
      if (public_id) {
        await cloudinary.uploader.destroy(public_id);
      }
    //   const result = await cloudinary.uploader.upload(req.file.path, {
    //     folder: "profile",
    //   });
    //   image = result.secure_url;
    //   public_id = result.public_id;
    // }
     // Use multer-storage-cloudinary uploaded info
      image = req.file.path; // URL from Cloudinary
      public_id = req.file.filename || req.file.public_id; // depends on multer-storage-cloudinary
    }

    if (profile) {
      // update existing
      profile.name = name;
      profile.image = image;
      profile.public_id = public_id;
      await profile.save();
    } else {
      // create first-time
      profile = await Profile.create({ name, image, public_id });
    }

    return res.status(200).json(profile);
  } catch (err) {
    console.error("Error saving profile:", err);
    return res.status(500).json({
      message: "Server Error: Unable to save profile",
      error: err.message,
    });
  }
};

module.exports = { getProfile, saveProfile, upload };
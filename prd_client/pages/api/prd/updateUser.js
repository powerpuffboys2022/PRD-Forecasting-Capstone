import dbConnect from "../../../services/MongoDb_Service";
const bcrypt = require("bcrypt");
const cookie = require("cookie");
const User = require("../../../models/User");
const jose = require("jose");

dbConnect();

const handler = async (req, res) => {
  try {
    let { updateMode, _id, userData } = req.body;

    // updateMode 
    // 0 -> Update 
    // -1 -> Delete Account

    if( updateMode === 0 && _id && userData ){
        if(userData.password){
            const hashedPass = await bcrypt.hash(userData.password, 10);
            userData.password = hashedPass;
        }
        
        const updateUser = await User.updateOne({ _id }, { $set : { ...userData }});
        return res.status(200).json({ message : "Updated Info" })
    }

    if(updateMode === -1 && _id){
        const updateUser = await User.deleteOne({ _id })
        return res.status(200).json({ message : "Account Deleted"})
    }
    
    return res.status(400).json({ message : "No updateMode specified, the server did nothin"})
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Error 😥",
    });
  }
};

export default handler;

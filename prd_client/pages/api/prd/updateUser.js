import dbConnect from "../../../services/MongoDb_Service";
const bcrypt = require("bcrypt");
const cookie = require("cookie");
const User = require("../../../models/User");
const jose = require("jose");

dbConnect();

const handler = async (req, res) => {
  try {
    let { mode, _id, content, filter, hasPass } = req.body;

    // mode 
    // 0 -> Update 
    // 1 -> Create
    // 2 -> Retrieve
    // -1 -> Delete Account
    if( mode === 0 && filter ){
        if(hasPass){ 
            const hashedPass = await bcrypt.hash(content.password, 10);
            content.password = hashedPass;
        }
        const updateUser = await User.updateOne({ ...filter }, { $set : { ...content }});
        return res.status(200).json({ message : "Updated Info" })
    }

    if(mode === 1 ){
        const isConflict = await User.findOne({ email : content.email })
        if( isConflict ) return res.status(409).json({ message : "Email already registered"})

        if(hasPass){ 
            const hashedPass = await bcrypt.hash(content.password, 10);
            content.password = hashedPass;
        }

        const create = await User.create({ ...content })
        return res.status(200).json({ message : "Created!"})
    }

    if( mode === 2 ) {
        const users = await User.find({})
        return res.status(200).json(users)
    }

    if(mode === -1 && _id){
        const updateUser = await User.deleteOne({ _id })
        return res.status(200).json({ message : "Account Deleted"})
    }
    
    return res.status(400).json({ message : "No mode specified, the server did nothin"})
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Error 😥",
    });
  }
};

export default handler;

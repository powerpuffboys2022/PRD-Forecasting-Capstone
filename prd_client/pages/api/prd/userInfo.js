import dbConnect from "../../../services/MongoDb_Service";
const bcrypt = require("bcrypt");
const cookie = require("cookie");
const User = require("../../../models/User");
const jose = require("jose");

dbConnect();

const handler = async (req, res) => {
  try {
    let { _id } = req.body;
    if (!_id) {
      const jwt = req.cookies.authorization_token

        try{
            const { payload, protectedHeader} = await jose.jwtVerify(jwt, new TextEncoder().encode(process.env.SECRET), {
                issuer: 'prd',
                audience: 'prd',
            })

            const userData = await User.findOne({ _id : payload._id });

            return res.status(200).json(userData)
        }catch(e){ 
            return res.status(401).json({ message : "Invalid authorization_token"})
        }
    }else{
        const userData = await User.findOne({_id})
        
        if(!userData) return res.status(404).json({ message : `user with _id(${_id}) can't be found`})

        return res.status(200).json(userData)
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Error 😥",
    });
  }
};

export default handler;

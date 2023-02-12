import dbConnect from "../../../services/MongoDb_Service";
const Chat = require("../../../models/Chat");


dbConnect();

const handler = async (req, res) => {
  try {

    let { mode, filter, content } = req.body;

    // mode 0 - get message { messageId } // id is from user

    if(mode === 0){
        let chat = await Chat.findOne(filter)
        if(!chat){ chat = await Chat.create({ ownerId : filter.ownerId }) }
        return res.status(200).json(chat)
    }

    // mode 1 - get message list

    // mode 2 - sent message { content }

    if(mode === 2) {
        let snt = await Chat.updateOne(filter, content)
        return res.status(200).json({ message : "sent ok!", snt})
    }

    return res
      .status(400)
      .json({ message: "No mode specified, the server did nothin" });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Error 😥",
    });
  }
};

export default handler;

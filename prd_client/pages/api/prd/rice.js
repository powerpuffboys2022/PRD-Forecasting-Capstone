import dbConnect from "../../../services/MongoDb_Service";
const Rice = require("../../../models/Rice");

dbConnect();

const handler = async (req, res) => {
  try {
    let { mode, _id, content } = req.body;

    if(mode === 0){ // get all rice
        const rices = await Rice.find({...content, isDeleted : false}).sort({dateAdded : -1});
        return res.status(200).json(rices);
    }

    if(mode === 1){ // create rice
        const rice = await Rice.create({...content});
        return res.status(200).json({ message : "created"});
    }

    if(mode === 2){ // update rice
        const rice = await Rice.updateOne({ _id }, { ...content })
        return res.status(200).json({ message : "updated"});
    }

    if(mode === 3){ // soft delete
        const rice = await Rice.updateOne({ ...content }, { $set : { isDeleted : true } });
        return res.status(200).json({ message : "set as deleted"});
    }

    if(mode === 4){ // getSpecificRice
        const rice = await Rice.findOne({ ...content });
        if(!rice) return res.status(404).json({ error : "Product can't be found."})
        return res.status(200).json(rice);
    }

    if(mode === -1){ // hard delete
        const rice = await Rice.updateOne({ ...content }, { $set : { isDeleted : true } });
        return res.status(200).json({ message : "unrecoverable delete"});
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

import dbConnect from "../../../services/MongoDb_Service";

dbConnect();

const handler = async (req, res) => {
  try {
    const { cookies } = req;
    const jwt = cookies.get("authorization_token");
    const url = req.url;
    let { mode, content } = req.body;

    // mode 0 - get message { messageId } // id is from user

    // if no message entry then create one

    // mode 1 - get message list

    // mode 2 - sent message { content }

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

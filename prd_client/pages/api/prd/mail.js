import Mailer from "../../../services/Mailer"

const handler = async (req, res) => {
  try {
    const { email, content } = req.body;

    if(!email || !content) return res.status(400).json({message : "Nothing to do"})

    let mailerResponse = await Mailer( email, content );

    return res
      .status(200)
      .json({ message: "Mail sent!" });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Error 😥",
    });
  }
};

export default handler;

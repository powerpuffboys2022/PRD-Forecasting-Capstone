import dbConnect from "../../../services/MongoDb_Service";
const Retail = require("../../../models/Retail");
const Forecast = require("../../../models/Forecast");

dbConnect();

const handler = async (req, res) => {
  try {
    let { mode, _id, content, batch, totalPrice } = req.body;

    // get all retail
    if (mode === 0) {
      const transactions = await Retail.find({
        ...content,
        isDeleted: false,
      });
      return res.status(200).json(transactions);
    }

    // batch create retail
    if (mode === 2) {
      const transaction = await Retail.insertMany(content);

      const doesExist = await Forecast.findOne({
        datew: content[0].datew,
      });

      if (content.length > 0) {
        if (!doesExist) {
          const upsforecast = await Forecast.create({
            date: new Date(content[0].date),
            datew: content[0].datew,
            totalSale: totalPrice,
          });
        } else {
          const upsforecast = await Forecast.updateOne(
            { datew: content[0].datew },
            { $inc: { totalSale: totalPrice } }
          );
        }
      }

      return res.status(200).json({ message: "created" });
    }

    // update retail
    if (mode === 3) {

      return res.status(200).json({ message: "updated" });
    }

    // batch soft delete retail
    if (mode === -2) {

      const transaction = await Retail.updateMany(
        { _id: { $in: batch } },
        { $set: { isDeleted: true } }
      );

      return res.status(200).json({ message: "set as deleted" });
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

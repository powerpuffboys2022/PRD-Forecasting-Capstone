import axios from "axios";
import dbConnect from "../../../services/MongoDb_Service";
const Rice = require("../../../models/Rice");
const Transaction = require("../../../models/Transaction");
const Forecast = require("../../../models/Forecast");

dbConnect();

const handler = async (req, res) => {
  try {
    let {
      mode,
      _id,
      updaterId,
      filter,
      content,
      batch,
      updateProduct,
      incr,
      pushToForeCast,
      project
    } = req.body;

    if (mode === 0) {
      // get transaction
      const transactions = await Transaction.find({
        ...content,
        isDeleted: false,
      });
      return res.status(200).json(transactions);
    }

    if (mode === 11) {
        if(!project) project = {
            rice : 1,
            totalPrice : 1,
            userId : 1,
            updatedBy : 1,
            status : 1,
            trackingDates : 1,
            reason : 1,
            processedBy : 1,
            isDeleted : 1,
            placedDate : 1,
            "ownerInfo.email" : 1,
            "ownerInfo.userName" : 1
        }
        if(!filter) filter = {}
        
        const transactions = await Transaction.aggregate([
            {
                $match : filter
            },
            {
                $lookup : {
                    from : "users",
                    localField : "userId",
                    foreignField: '_id',
                    as : "ownerInfo"
                }
            },
            {
                "$project": project
            }
        ]);
        return res.status(200).json(transactions);
      }

    if (mode === 1) {
      // create order / checkout
      const transaction = await Transaction.create({ ...content });
      // also clear user cart
      return res.status(200).json({ message: "created", transaction });
    }

    if (mode === 2) {
      // update transaction

      if (pushToForeCast) {
        const doesExist = await Forecast.findOne({
          datew: content.completedDateWord,
        });

        if (!doesExist) {
          const upsforecast = await Forecast.create({
            date: new Date(content.trackingDates.completed),
            datew: content.completedDateWord,
            totalSale: content.totalPrice,
          });
          console.log("Created new forecast today ", upsforecast)
        } else {
          const upsforecast = await Forecast.updateOne(
            { datew: content.completedDateWord },
            { $inc: { totalSale: content.totalPrice } }
          );

          console.log("Updated forecast today ", upsforecast)
        }
      }

        const transaction = await Transaction.updateOne(
          { _id },
          { $set: { ...content } }
        );

        if (updateProduct) {
          if (incr) {
            content.rice.map(async (rc) => {
              let foc = await Rice.updateOne(
                { _id: rc._id },
                { $inc: { stock: rc.qty } }
              );
            });
          } else {
            content.rice.map(async (rc) => {
              let foc = await Rice.updateOne(
                { _id: rc._id },
                { $inc: { stock: -rc.qty } }
              );
            });
          }
        }

      return res.status(200).json({ message: "updated" });
    }

    if (mode === 3) {
      // soft delete
      const transaction = await Transaction.updateOne(
        { ...content },
        { $set: { isDeleted: true } }
      );
      return res.status(200).json({ message: "set as deleted" });
    }

    if (mode === -2) {
      // batch soft delete
      const transaction = await Transaction.updateMany(
        { _id: { $in: batch } },
        { $set: { isDeleted: true } }
      );
      return res.status(200).json({ message: "set as deleted" });
    }

    if (mode === 4) {
      // get specific transaction
      const transaction = await Transaction.findOne({
        ...content,
        isDeleted: false,
      });
      if (!transaction) {
        return res
          .status(404)
          .json({ message: "this transaction is not found" });
      }
      return res.status(200).json(transaction);
    }

    if (mode === -1) {
      // hard delete
      const rice = await Rice.updateOne(
        { ...content },
        { $set: { isDeleted: true } }
      );
      return res.status(200).json({ message: "unrecoverable delete" });
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

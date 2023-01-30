import { Schema, model, models } from 'mongoose';

const TransactionSchema = new Schema({
  rice : { type : [], required : true }, // { _id, name, imgUrl, price, netWeight, qty }
  totalPrice : { type : Number, required : true },
  userId : { type : Schema.Types.ObjectId, required : true}, // from who
  updatedBy : { type : Schema.Types.ObjectId, default : null }, // who accepted/decline this transaction
  status : { type : Number, default : 1 }, // -1 canceled, 1 - pending, 2 - processing, 3 - shipping , 4 - delivered
  placedDate : { type : Date, default : Date.now }, // placedDate
  trackingDates : { type : {}, default : {
    processed : null, // date where it was processed
    shipped : null, // date where it was shipped
    completed : null, // date where its delivered & completed
    canceledDate : null,
  }},
  reason : { type : String, default : ""}, // reason why it is declined/canceled
  processedBy : { type : Schema.Types.ObjectId, default : null },
  isDeleted : { type : Boolean, default : false} // for soft delete
});

/** TODO 
 * ONCE delivered, add all rice in this transaction to Sack Collection
 * Then decrement from stock
 */
const Transaction = models.Transaction || model('Transaction', TransactionSchema);

module.exports = Transaction;
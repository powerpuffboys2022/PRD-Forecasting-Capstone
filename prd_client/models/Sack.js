import { Schema, model, models } from 'mongoose';

const TransactionSchema = new Schema({
  riceId : { type : Schema.Types.ObjectId, required : true },
  netWeight : { type : Number, required : true },
  price : { type : Number, required : true },
  quantity : { type : Number, required : true },
  dateTime : { type : Date, default : Date.now },
  totalPrice : { type : Number, required : true },

  transactionId : { type : Schema.Types.ObjectId, required : true},
  status : { type : Number, default : 1 } // 1 - pending, 2 - processing, 3 - shipping , 4 - delivered
});

const Transaction = models.Transaction || model('Transaction', TransactionSchema);

module.exports = Transaction;
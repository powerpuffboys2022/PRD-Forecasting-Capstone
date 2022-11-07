import { Schema, model, models } from 'mongoose';

const SackSchema = new Schema({
  riceId : { type : Schema.Types.ObjectId, required : true },
  weightNet : { type : Number, required : true },
  price : { type : Number, required : true },
  quantity : { type : Number, required : true },
  date : { type : Date, default : Date.now },
  time : { type : Date, default : Date.now },
  totalPrice : { type : Number, required : true }
});

const Sack = models.Sack || model('Sack', SackSchema);

module.exports = Sack;
import { Schema, model, models } from 'mongoose';

const RetailSchema = new Schema({
  riceId : { type : Schema.Types.ObjectId, required : true },
  kg : { type : Number, required : true },
  pricePerKg : { type : Number, default : 0 },
  date : { type : Date, default : Date.now },
  time : { type : Date, default : Date.now },
  totalPrice : { type : Number, required : true }
});

const Retail = models.Retail || model('Retail', RetailSchema);

module.exports = Retail;
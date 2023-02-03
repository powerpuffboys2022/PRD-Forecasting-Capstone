import { Schema, model, models } from 'mongoose';

const RetailSchema = new Schema({
  riceId : { type : Schema.Types.ObjectId, required : true },
  riceName : { type : String, required : true },
  imgUrl : { type : String, default : "/emptyimage.png" },
  kg : { type : Number, required : true },
  netWeight : { type : Number, required : true , default : 0},
  pricePerKg : { type : Number, default : 0 },
  date : { type : Date, default : Date.now },
  time : { type : Date, default : Date.now },
  totalPrice : { type : Number, required : true },
  createdBy : { type : Schema.Types.ObjectId, default : null },
  isDeleted : { type : Boolean, default : false} // for soft delete
});

const Retail = models.Retail || model('Retail', RetailSchema);

module.exports = Retail;
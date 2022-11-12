import { Schema, model, models } from 'mongoose';

const RiceSchema = new Schema({
  name : { type : String, required : true },
  articleName : { type : String, required : true },
  articleCode : { type : String },
  price : { type : Number, require : true, default : 0},
  purchased : { type : Number, require : true, default : 0},
  sold : { type : Number, default : 0 },
  stock : { type : Number, required : true },
  pricePerKg : { type : Number, required : true },
  weightNet : { type : Number, require : true },
  dateAdded : { type : Date, default : Date.now }
});

const Rice = models.Rice || model('Rice', UserSchema);

module.exports = Rice;
import { Schema, model, models } from 'mongoose';

const RiceSchema = new Schema({
  articleName : { type : String, required : true }, // name ng bigas
  articleCode : { type : String }, // shortcut ng name
  description : { type : String, required : true}, // malagkit something
  price : { type : Number, require : true, default : 0},
  imgUrl : { type : String, require : true },
  purchased : { type : Number, require : true, default : 0}, // purchased per kg ata?
  sold : { type : Number, default : 0 }, // sack ata?
  stock : { type : Number, required : true },
  pricePerKg : { type : Number, required : true },
  netWeight : { type : Number, require : true },
  dateAdded : { type : Date, default : Date.now },
  isDeleted : { type : Boolean, default : false}
});

const Rice = models.Rice || model('Rice', RiceSchema);

module.exports = Rice;
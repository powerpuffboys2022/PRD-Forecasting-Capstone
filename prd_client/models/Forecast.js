import { Schema, model, models } from 'mongoose';

const ForecastSchema = new Schema({
  date : { type : Date , required : true },
  datew : { type : String, required : true, unique : true}, // 2022-1-31 // YYYY MM DD
  totalSale : { type : Number, default : 0 },
  isDeleted : { type : Boolean, default : false} // for soft delete
});

const Forecast = models.Forecast || model('Forecast', ForecastSchema);
module.exports = Forecast;
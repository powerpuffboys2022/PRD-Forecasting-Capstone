import { Schema, model, models } from 'mongoose';

const ForecastSchema = new Schema({
  date : { type : Date , required : true },
  datew : { type : String, required : true, unique : true}, // 1-31-2022
  totalSale : { type : Number, default : 0 }
});

const Forecast = models.Forecast || model('Forecast', ForecastSchema);

export default Forecast;
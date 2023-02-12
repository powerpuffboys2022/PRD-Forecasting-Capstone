import { Schema, model, models } from 'mongoose';

const SettingSchema = new Schema({
  settingsName : { type : Date , required : true },
  value : { type : {}, default : {}, required : true },
  isDeleted : { type : Boolean, default : false}
});

const Settings = models.Settings || model('Settings', SettingSchema);
module.exports = Settings;
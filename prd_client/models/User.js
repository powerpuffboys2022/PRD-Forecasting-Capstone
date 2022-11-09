import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  email : { type : String, required : true, unique : true },
  imgUrl : { type : String, default : ""},
  userName : { type : String, required : true },
  password : { type : String, required : true },
  dateJoined : { type : Date, default : Date.now },
  signInCount : { type : Number, default : 0 }
});

const User = models.User || model('User', UserSchema);

module.exports = User;
import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  email : { type : String, required : true, unique : true },
  imgUrl : { type : String, default : "https://cdn.discordapp.com/attachments/1040843356441423882/1076767514501058620/blank-profile-picture-973460_640.png"},
  userName : { type : String, required : true },
  password : { type : String, required : true },
  userType : { type : Number, default : 0 }, // 0 - user, 1 - admin, 2 - ?
  dateJoined : { type : Date, default : Date.now },
  signInCount : { type : Number, default : 0 },
  address : { type : String, required : true },
  contact : { type : String, required : true},
  cart : { type : [], default : [] }

  /*
    {
        riceId,
        qty,
    }
  */
});

const User = models.User || model('User', UserSchema);

module.exports = User;
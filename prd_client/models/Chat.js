import { Schema, model, models } from 'mongoose';

const ChatSchema = new Schema({
  rice : { type : [], required : true },
  adminUnread : { type : Boolean, default : true },
  userUnread : { type : Boolean, default : true },
  chat : [],
//   {
//     id,
//     userName,
//     imgUrl,
//     email,
//     type,
//     message
//   }
  isDeleted : { type : Boolean, default : false } // for soft delete
});
const Chat = models.Chat || model('Chat', ChatSchema);

module.exports = Chat;
import { Schema, model, models } from 'mongoose';

const ChatSchema = new Schema({
  ownerId : { type : Schema.Types.ObjectId, required : true },
  adminUnread : { type : Boolean, default : true },
  userUnread : { type : Boolean, default : true },
  chats : { type : Array, default : []},
  cat : { type : Date, default : Date.now },
//   {
//     id,
//     userName,
//     imgUrl,
//     email,
//     type, // 0 - text, 1 - url/link
//     message
//   }
  lastChat : { type : Date, default : Date.now },
  isDeleted : { type : Boolean, default : false } // for soft delete
});
const Chat = models.Chat || model('Chat', ChatSchema);

module.exports = Chat;
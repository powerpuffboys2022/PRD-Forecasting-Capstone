import { Schema, model, models } from 'mongoose';

const ChatSchema = new Schema({
  rice : { type : [], required : true },
  trackingDates : { type : {}, default : {
    Sender : null, // date where it was processed
    Type : null, // date where it was shippe
  }},
  reason : { type : String, default : ""}, // reason why it is declined/canceled
  processedBy : { type : Schema.Types.ObjectId, default : null },
  isDeleted : { type : Boolean, default : false} // for soft delete
});
const Chat = models.Chat || model('Chat', ChatSchema);

module.exports = Chat;
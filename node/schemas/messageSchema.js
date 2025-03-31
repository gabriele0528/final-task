const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const messageSchema = new Schema({
    fromUserId:{
        type: String,
        required: true,
    },
    toUserId:{
        type: String,
        required: true,
    },
    content:{
      type: String,
      required: true,
    },
    createdDate:{
        type: Date,
        default: Date.now
    }


});

module.exports = mongoose.model("messages", messageSchema);
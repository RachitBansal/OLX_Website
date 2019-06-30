const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const messageSchema = new Schema({
    message: String,
    adId: ObjectId,
    userId: ObjectId,
    from: String
});

module.exports = mongoose.model("Message", messageSchema)
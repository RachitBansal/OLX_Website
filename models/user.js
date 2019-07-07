const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userScehma = new Schema({
    email: String,
    password: String
});

module.exports = mongoose.model("User", userScehma)


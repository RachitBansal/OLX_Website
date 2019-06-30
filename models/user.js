const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/OLX', { useNewUrlParser: true });

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    password: String
});

const User = mongoose.model('User', UserSchema);

module.exports = mongoose.model('User')
// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/OLX', { useNewUrlParser: true });

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    password: String
});

//

const User = mongoose.model('User', UserSchema);

module.exports = mongoose.model('User')

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userScehma = new Schema({
    email: String,
    password: String
});

module.exports = mongoose.model("User", userScehma)


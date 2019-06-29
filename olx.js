var express = require('express')
var app = express()
app.set("view engine", "ejs")
app.use(express.static('public'))
var fs = require('fs')
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/newdb', { useNewUrlParser: true });
var session = require('express-session')
var _ = require("lodash")
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const crypto = require('crypto');

var bodyParser = require("body-parser")
// var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const secret = 'abcdefg';
const UserSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    password: String
});

const User = mongoose.model('User', UserSchema);

app.get('/', (req, res) => {
    res.render("home")
})

app.get('/404', (req, res) => {
    res.send("404 error")
})

app.get('/user/login', (req, res) => {
    res.render("login")
})

app.post('/user/login', urlencodedParser, (req, res) => {
    switch (req.body.action) {
        case 'signup':
            User.findOne({ email: req.body.email }, function (err, doc) {
                if (err) {
                    console.log(err, 'error')
                    res.redirect('/')
                    return
                }
                if (_.isEmpty(doc)) {
                    let newUser = new User();
                    newUser.email = req.body.email;
                    newUser.password = req.body.password;
                    newUser.save(function (err) {
                        if (err) {
                            console.log(err, 'error')
                            return
                        }
                        res.render('login', { message: "Sign Up Successful. Please log in." })
                    });

                } else {
                    res.render('login', { message: "User already exists" })
                }
            })
            break;
        case 'login':
            User.findOne({ email: req.body.email, password: req.body.password }, function (err, doc) {
                if (err) {
                    console.log(err, 'error')
                    res.redirect('/')
                    return
                }
                if (_.isEmpty(doc)) {
                    res.render('login', { message: "Please check email/password" })
                } else {
                    req.session.user = doc
                    res.redirect('/user')
                }
            })
            break;
    }

})


const checkLogIn = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/404')
    }
}

app.get('/user', checkLogIn, (req, res) => {
    res.render('user', { user: req.session.user })
})


app.listen(3000, () => {
    console.log("Server is running")
})
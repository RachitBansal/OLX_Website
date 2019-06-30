app.listen(3000, () => {
    console.log("Server is running")
})

var express = require('express')
var app = express()

app.set("view engine", "ejs")

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/OLX', { useNewUrlParser: true });

var session = require('express-session')
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 1160000 } }))

var userController = require('./controllers/user.js')
var adController = require('./controllers/ad.js')

var Ad = require("./models/ad")

app.get('/', (req, res) => {
    Ad.find({}, (err, docs) => {
        res.render('home', { user: req.session.user, ads: docs })
    })
})

app.use('/user', userController)
app.use('/ad', adController)

app.listen(3006, () => {
    console.log("Server is running")
})
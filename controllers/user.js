var express = require('express')
var router = express.Router();

var bodyParser = require("body-parser")
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const User = require("../models/user")
const Ad = require("../models/ad")
const Message = require("../models/message")
const _ = require("lodash")

const checkLogIn = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/')
    }
}

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', urlencodedParser, (req, res) => {
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
                        res.redirect('login', { message: "Sign Up Successful. Please log in." })
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
                    res.redirect('/user/dashboard')
                }
            })
            break;
    }

})

router.get('/dashboard', checkLogIn, (req, res) => {
    Ad.find({ postedBy: req.session.user._id }, (err, docs) => {
        res.render('user', { user: req.session.user, ads: docs })
    })
})

router.post('/dashboard', urlencodedParser, checkLogIn, (req, res) => {
    let newAd = new Ad()
    newAd.name = req.body.name
    newAd.postedBy = req.session.user._id
    newAd.save(function (err) {
        res.redirect("/user/dashboard")
    })
})

router.get('/ad/:id/chats', checkLogIn, async (req, res) => {
    let messages = await Message.find({ adId: req.params.id })
    messages = _.groupBy(messages, 'userId')
    messages = _.map(messages, (value) => { return value })
    res.render('ownerchats', { user: req.session.user, messages: messages })
})
router.post('/ad/:id/chats', urlencodedParser, checkLogIn, (req, res) => {
    let newMessage = new Message()

    newMessage.message = req.body.message
    newMessage.userId = req.body.userid
    newMessage.adId = req.params.id

    newMessage.save(function (err) {
        console.log(err)
        res.redirect(`/user/ad/${req.params.id}/chats`)
    })
})

router.get('/logout', checkLogIn, (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

module.exports = router
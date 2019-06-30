var express = require('express')
var router = express.Router();

var bodyParser = require("body-parser")
var urlencodedParser = bodyParser.urlencoded({ extended: false })

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

router.get('/:id', async (req, res) => {
    let ad = await Ad.findById(req.params.id)

    let messages = []
    if (req.session.user) {
        messages = await Message.find({
            adId: req.params.id,
            userId: req.session.user._id
        })
    }

    res.render("ad", { user: req.session.user, messages: messages, ad: ad })
})

router.post('/:id', urlencodedParser, checkLogIn, (req, res) => {
    let newMessage = new Message()

    newMessage.message = req.body.message
    newMessage.userId = req.session.user._id
    newMessage.from = "user"
    newMessage.adId = req.params.id

    newMessage.save(function (err) {
        res.redirect(`/ad/${req.params.id}`)
    })
})

module.exports = router
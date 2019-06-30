var express = require('express')
var app = express()
app.set("view engine", "ejs")

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/newdb', { useNewUrlParser: true });
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

var session = require('express-session')
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 1160000 } }))

const _ = require("lodash")

var bodyParser = require("body-parser")
var urlencodedParser = bodyParser.urlencoded({ extended: false })


const adScehma = new Schema({
    name: String,
    postedBy: ObjectId
});

const adModel = mongoose.model("Ad", adScehma)

const messageSchema = new Schema({
    message: String,
    adId: ObjectId,
    userId: ObjectId,
    from: String
});

const messageModel = mongoose.model("Message", messageSchema)

const userScehma = new Schema({
    email: String,
    password: String
});

const userModel = mongoose.model("User", userScehma)


app.get('/', (req, res) => {
    adModel.find({}, (err, docs) => {
        res.render('index', { user: req.session.user, ads: docs })
    })
})

const checkLogIn = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/')
    }
}

//Ad Routes
app.get('/ad/:id', async (req, res) => {
    let ad = await adModel.findById(req.params.id)

    let messages = []
    if (req.session.user) {
        messages = await messageModel.find({
            adId: req.params.id,
            userId: req.session.user._id
        })
    }

    res.render("ad", { user: req.session.user, messages: messages, ad: ad })
})

app.post('/ad/:id', urlencodedParser, checkLogIn, (req, res) => {
    let newMessage = new messageModel()

    newMessage.message = req.body.message
    newMessage.userId = req.session.user._id
    newMessage.from = "user"
    newMessage.adId = req.params.id

    newMessage.save(function (err) {
        res.redirect(`/ad/${req.params.id}`)
    })
})

//User Routes

app.get('/user/login', (req, res) => {
    res.render('login')
})

app.post('/user/login', urlencodedParser, (req, res) => {
    switch (req.body.action) {
        case 'signup':
            userModel.findOne({ email: req.body.email }, function (err, doc) {
                if (err) {
                    console.log(err, 'error')
                    res.redirect('/')
                    return
                }
                if (_.isEmpty(doc)) {
                    let newUser = new userModel();
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
            userModel.findOne({ email: req.body.email, password: req.body.password }, function (err, doc) {
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

app.get('/user/dashboard', checkLogIn, (req, res) => {
    adModel.find({ postedBy: req.session.user._id }, (err, docs) => {
        res.render('user', { user: req.session.user, ads: docs })
    })
})

app.post('/user/dashboard', urlencodedParser, checkLogIn, (req, res) => {
    let newAd = new adModel()
    newAd.name = req.body.name
    newAd.postedBy = req.session.user._id
    newAd.save(function (err) {
        res.redirect("/user/dashboard")
    })
})

app.get('/user/ad/:id/chats', checkLogIn, async (req, res) => {
    let messages = await messageModel.find({ adId: req.params.id })
    messages = _.groupBy(messages, 'userId')
    messages = _.map(messages, (value) => { return value })
    res.render('ownerchats', { user: req.session.user, messages: messages })
})
app.post('/user/ad/:id/chats', urlencodedParser, checkLogIn, (req, res) => {
    let newMessage = new messageModel()

    newMessage.message = req.body.message
    newMessage.userId = req.body.userid
    newMessage.adId = req.params.id

    newMessage.save(function (err) {
        console.log(err)
        res.redirect(`/user/ad/${req.params.id}/chats`)
    })
})

app.get('/user/logout', checkLogIn, (req, res) => {
    req.session.destroy()
    res.redirect('/')
})


app.listen(3000, () => {
    console.log("Server is running")
})
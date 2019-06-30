var express = require('express')
var Router = express()

var bodyParser = require("body-parser")
// var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var user = require("../models/user.js")


Router.get('/', (req, res) => {
    res.render("home")
})

Router.get('/404', (req, res) => {
    res.send("404 error")
})

Router.get('/login', (req, res) => {
    res.render("login")
})

var middleware = (req,res,next) => {
    
}

Router.get('/user/dashboard',middleware,(req,res) => {
    res.render()
})

Router.post('/login', urlencodedParser, (req, res) => {
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
                    res.redirect('/404')
                    return
                }
                if (_.isEmpty(doc)) {
                    res.render('/', { message: "Please check email/password" })
                } else {
                    req.session.user = doc
                    res.redirect('/dashboard')
                }
            })
            break;
    }

})

Router.get('/dashboard',(req,res)=>{
    res.render('dashboard')
})

module.exports = Router
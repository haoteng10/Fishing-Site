const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");

// ROOT ROUTE
router.get("/", function(req,res){
      res.render("landing");
});

// ERROR ROUTE
router.get("/error",function(req, res){
    res.render("construction");
});

// REGISTER FORM ROUTE
router.get("/register", function(req, res) {
    res.render("register");
});

//REGISTER LOGIC ROUTE
router.post("/register", function(req, res) {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err){
            console.log("Register logic error");
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/");
            });
        }
    });
});

// LOGIN FORM ROUTE
router.get("/login", function(req, res) {
    res.render("login");
})

// LOGIN LOGIC ROUTE
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/",
        failureRedirect: "/login"
    }), function(req, res){
    });

// LOGOUT ROUTE
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
})

module.exports = router;


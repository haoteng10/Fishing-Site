const express = require("express");
const app = express();

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
// const SeedDB = require("./seeds");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/User");

// const middleware = require("./middleware");

require("dotenv").config();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));

mongoose.Promise = require("bluebird");

const url = process.env.DATABASEURL || "mongodb://localhost/fishing_site";
mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });
// SeedDB();

// Require routes
const indexRoutes = require("./routes/index");
const sitesRoutes = require("./routes/FishingSites");
const commentRoutes = require("./routes/Comments");

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Encrption-Secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
//   res.locals.isAuthenticated = middleware.isLoggedIn; This is not working
   next();
});


// Use routes
app.use("/", indexRoutes);
app.use("/sites", sitesRoutes);
app.use("/sites/:id/comments", commentRoutes);

app.listen(3000, process.env.IP, function(){
   console.log("The Server Has Started!");
});
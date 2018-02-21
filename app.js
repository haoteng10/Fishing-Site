var express = require("express");
var app = express();

var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var SeedDB = require("./seeds");
var passport = require("passport");
var LocalStrategy = require("passport-local");

var User = require("./models/User");

var middleware = require("./middleware");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));


var url = process.env.DATABASEURL || "mongodb://localhost/fishing_site";
mongoose.connect(url, {useMongoClient: true});
// SeedDB();

// Require routes
var indexRoutes = require("./routes/index");
var sitesRoutes = require("./routes/FishingSites");
var commentRoutes = require("./routes/Comments");

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

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Server Has Started!");
});
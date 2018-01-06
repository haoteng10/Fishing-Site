var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var SeedDB = require("./seeds");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb://localhost/fishing_site", {useMongoClient: true});

SeedDB();

var indexRoutes = require("./routes/index");
var sitesRoutes = require("./routes/FishingSites");

app.use("/", indexRoutes);
app.use("/sites", sitesRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Server Has Started!");
});
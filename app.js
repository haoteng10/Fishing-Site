var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
// var ejsLint = require('ejs-lint');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost/fishing_site", {useMongoClient: true});


// SCHEMA SETUP
var siteSchema = new mongoose.Schema({
   name: String,
   url: String,
   location: String,
   description: String
});

var Sites = mongoose.model("Site", siteSchema);

app.get("/", function(req,res){
      res.render("landing");
});

var userValue;

app.post("/sites/locate", function(req, res) {
    userValue = req.body.city;
    res.redirect("/sites");
});

app.get("/sites", function(req,res){
    Sites.find({}, function(err, allSites){
        if(err){
        console.log(err);
       } else {
          res.render("sites",{Sites:allSites, value:userValue});
       }
})});

app.post("/sites", function(req,res){
    // get data from form and add to fishing sites array
    var name = req.body.name;
    var url = req.body.url;
    var location = req.body.loc;
    var desc = req.body.description;
    var newSite = {name: name, url: url, location: location, description: desc};
    
    // Create a new campground and save to DB
    Sites.create(newSite, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to the page
            res.redirect("/sites");
        }
    });
    
});

app.get("/sites/new",function(req, res) {
   res.render("new"); 
});


app.get("/sites/:id",function(req, res) {
    res.redirect("/error");
});

app.get("/error",function(req, res) {
    res.render("construction");
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Server Has Started!");
});
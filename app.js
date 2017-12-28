var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

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

var Site = mongoose.model("Site", siteSchema);


// var fishingSite = [{
//     name: "Great Grand Park",
//     url : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT84UgoxCM4rb51iQm-AxgYKxijqTPoTF-Ge59RtNJRQPnvqVsv"}
//     ];

app.get("/", function(req,res){
      res.render("landing");
});

app.get("/sites", function(req,res){
      res.render("sites");
});

app.post("/sites", function(req,res){
    // get data from form and add to fishing sites array
    var name = req.body.name;
    var url = req.body.url;
    var location = req.body.loc;
    var desc = req.body.description;
    var newSite = {name: name, url: url, location: location, description: desc};
    
    // Create a new campground and save to DB
    Site.create(newSite, function(err, newlyCreated){
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

// app.post("/sites/locate",function(req, res) {
//     var value = req.body.city;
//     if (value === "NYC") {
//         res.redirect("/sites/nyc");
//     }else{
//       res.redirect("/error"); 
//     }
// });

app.get("/sites/:id",function(req, res) {
    res.redirect("/error");
})

app.get("/error",function(req, res) {
    res.render("construction");
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The server has been started!");
});
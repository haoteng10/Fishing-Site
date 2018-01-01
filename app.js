var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var Sites = require("./models/FishingSite");
var SeedDB = require("./seeds");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb://localhost/fishing_site", {useMongoClient: true});

SeedDB();

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
          res.render("FishingSites/sites",{Sites:allSites, value:userValue});
       }
    });
});

app.post("/sites", function(req,res){
    
    // Create a new fishingSite and save to DB
    Sites.create(req.body.site, function(err, newlyCreated){
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
    Sites.findById(req.params.id, function(err, foundSite){
        if(err){
            console.log(err);
        } else {
            //render show template with that fishingSite
            res.render("FishingSites/show", {site: foundSite});
        }});
    });

app.delete("/sites/:id", function(req,res) {
   Sites.findById(req.params.id, function(err, site){
       if (err){
           res.redirect("/error");
       } else {
           site.remove();
           res.redirect("/sites");
       }
   }) 
});

app.get("/sites/:id/edit", function(req, res){
    Sites.findById(req.params.id, function(err, foundSite){
        if(err){
            res.redirect("/error");
        } else {
            res.render("FishingSites/edit", {site: foundSite});
        }
    });
})

app.put("/sites/:id", function(req,res){
    Sites.findByIdAndUpdate(req.params.id, req.body.site, function(err, wholeNewSite){
        if (err){
            console.log(err);
            res.redirect("/error");
        } else {
            res.redirect("/sites/" + req.params.id);
        }
    }); 
});

app.get("/error",function(req, res) {
    res.render("construction");
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Server Has Started!");
});
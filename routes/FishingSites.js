var express = require("express");
var router = express.Router();
var Sites = require("../models/FishingSite");
var Comments = require("../models/Comment")

var userValue;

router.post("/locate", function(req, res) {
    userValue = req.body.city;
    res.redirect("/sites");
});

router.get("/", function(req,res){
    Sites.find({}, function(err, allSites){
        if(err){
        console.log(err);
       } else {
          res.render("FishingSites/sites",{Sites:allSites, value:userValue});
       }
    });
});

router.post("/", function(req,res){
    
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

router.get("/new",function(req, res) {
   res.render("FishingSites/new"); 
});


router.get("/:id",function(req, res) {
    Sites.findById(req.params.id).populate("comments").exec(function(err, foundSite){
        if(err){
            console.log(err);
        } else {
            //render show template with that fishingSite
            res.render("FishingSites/show", {site: foundSite});
        }});
    });

router.delete("/:id", function(req,res) {
   Sites.findById(req.params.id, function(err, site){
       if (err){
           res.redirect("/error");
       } else {
           site.remove();
           res.redirect("/sites");
       }
   }) 
});

router.get("/:id/edit", function(req, res){
    Sites.findById(req.params.id, function(err, foundSite){
        if(err){
            res.redirect("/error");
        } else {
            res.render("FishingSites/edit", {site: foundSite});
        }
    });
})

router.put("/:id", function(req,res){
    Sites.findByIdAndUpdate(req.params.id, req.body.site, function(err, wholeNewSite){
        if (err){
            console.log(err);
            res.redirect("/error");
        } else {
            res.redirect("/sites/" + req.params.id);
        }
    }); 
});

module.exports = router;
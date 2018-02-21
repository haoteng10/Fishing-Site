var express = require("express");
var router = express.Router();
var Sites = require("../models/FishingSite");
// var Comments = require("../models/Comment");
var middleware = require("../middleware");

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

router.post("/", middleware.isLoggedIn, function(req,res){
    var newlyCreatedSite = {
      name: req.body.site.name,
      url: req.body.site.url,
      description: req.body.site.description,
      location: req.body.site.location,
      author: {
          id: req.user._id,
          username: req.user.username
      }
    };
    // Create a new fishingSite and save to DB
    Sites.create(newlyCreatedSite, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to the page
            res.redirect("/sites");
        }
    });
    
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("FishingSites/new"); 
});


router.get("/:id",function(req, res) {
    Sites.findById(req.params.id).populate("comments").exec(function(err, foundSite){
        
        var LoggedIn = false;
        var trueSiteOwnership = false;
        
        if(err){
            console.log(err);
        } else {
           
           if(req.isAuthenticated()){
               LoggedIn = true;
               if (foundSite.author.id.equals(req.user._id)) {
               trueSiteOwnership = true;
             }
           }
           
            // console.log(req.user._id);
            //render show template with that fishingSite
            res.render("FishingSites/show", {site: foundSite, trueSiteOwnership: trueSiteOwnership, LoggedIn: LoggedIn});
            
        }});
    });

router.delete("/:id", middleware.checkSiteOwnership, function(req,res) {
   Sites.findById(req.params.id, function(err, site){
       if (err){
           res.redirect("/error");
       } else {
           site.remove();
           res.redirect("/sites");
       }
   });
});

router.get("/:id/edit", middleware.checkSiteOwnership, function(req, res){
    Sites.findById(req.params.id, function(err, foundSite){
        if(err){
            res.redirect("/error");
        } else {
            res.render("FishingSites/edit", {site: foundSite});
        }
    });
})

router.put("/:id", middleware.checkSiteOwnership, function(req,res){
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
var express = require("express");
var router  = express.Router({mergeParams: true});
var Sites = require("../models/FishingSite");
var Comment = require("../models/Comment");

router.get("/new", function(req, res){
    Sites.findById(req.params.id, function(err, foundSite){
        if (err){
            console.log(err);
        } else {
            res.render("Comments/new", {site: foundSite});
        }
    });
    
});

router.post("/", function(req, res){
    Sites.findById(req.params.id, function(err, foundSite){
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err){
                    console.log(err);
                } else {
                    foundSite.comments.push(comment);
                    foundSite.save();
                    res.redirect("/sites/" + req.params.id);
                }
            })
        }
    })
})

module.exports = router;
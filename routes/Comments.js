var express = require("express");
var router  = express.Router({mergeParams: true});
var Sites = require("../models/FishingSite");
var Comments = require("../models/Comment");
var middleware = require("../middleware");

// COMMENT NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
    Sites.findById(req.params.id, function(err, foundSite){
        if (err){
            console.log(err);
        } else {
            res.render("Comments/new", {site: foundSite});
        }
    });
    
});

// COMMENT ADD ROUTE
router.post("/", middleware.isLoggedIn, function(req, res){
    var newlyCreatedComment = {
        text: req.body.comment.text,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    };
    Sites.findById(req.params.id, function(err, foundSite){
        if (err) {
            console.log(err);
        } else {
            Comments.create(newlyCreatedComment, function(err, comment){
                if (err){
                    console.log(err);
                } else {
                    foundSite.comments.push(comment);
                    foundSite.save();
                    res.redirect("/sites/" + req.params.id);
                }
            });
        }
    });
});

//COMMENT EDIT ROUTE
router.get("/:commentId/edit", middleware.checkCommentOwnership, function(req, res){
    Comments.findById(req.params.commentId, function(err, foundComment) {
        if (err){
            console.log(err);
        } else {
            res.render("Comments/edit", {comment: foundComment, site_id: req.params.id});
        }    
        
    });
    
});

// COMMENT UPDATE ROUTE
router.put("/:commentId", middleware.checkCommentOwnership, function(req, res){
    Comments.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, updatedComment){
        if (err){
            console.log("Comment Update went wrong!");
        } else {
            res.redirect("/sites/" + req.params.id);
        }
    });
});

// COMMENT DESTROY ROUTE
router.delete("/:commentId", middleware.checkCommentOwnership, function(req, res){
    Comments.findByIdAndRemove(req.params.commentId, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/sites/" + req.params.id);
        }
    }); 
});

module.exports = router;
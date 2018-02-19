var Comments = require("../models/Comment");
var Sites = require("../models/FishingSite");
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

middlewareObj.checkSiteOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Sites.findById(req.params.id, function(err, foundSite){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundSite.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comments.findById(req.params.commentId, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = middlewareObj;
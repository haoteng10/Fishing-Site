const express = require("express");
const router  = express.Router({mergeParams: true});
const Sites = require("../models/FishingSite");
const Comments = require("../models/Comment");
const middleware = require("../middleware");

// COMMENT NEW ROUTE
router.get("/new", middleware.isLoggedIn, async (req, res) => {
    const foundSite = await Sites.findById(req.params.id);
    res.render("Comments/new", {site: foundSite});  
});

// COMMENT ADD ROUTE
router.post("/", middleware.isLoggedIn, async (req, res) => {
    const newlyCreatedComment = {
        text: req.body.comment.text,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    };

    const foundSite = await Sites.findById(req.params.id);
    const newComment = await Comments.create(newlyCreatedComment);
    foundSite.comments.push(newComment);
    foundSite.save();

    res.redirect("/sites/" + req.params.id);
});

//COMMENT EDIT ROUTE
router.get("/:commentId/edit", middleware.checkCommentOwnership, async (req, res) => {
    const foundComment = await Comments.findById(req.params.commentId);
    res.render("Comments/edit", {comment: foundComment, site_id: req.params.id});
});

// COMMENT UPDATE ROUTE
router.put("/:commentId", middleware.checkCommentOwnership, async (req, res) => {
    await Comments.findByIdAndUpdate(req.params.commentId, req.body.comment);
    res.redirect("/sites/" + req.params.id);
});

// COMMENT DESTROY ROUTE
router.delete("/:commentId", middleware.checkCommentOwnership, async (req, res) => {
    await Comments.findByIdAndRemove(req.params.commentId);
    res.redirect("/sites/" + req.params.id);
});

module.exports = router;
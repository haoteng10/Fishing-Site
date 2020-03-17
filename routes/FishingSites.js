const express = require("express");
const router = express.Router();
const Sites = require("../models/FishingSite");
// const Comments = require("../models/Comment");
const middleware = require("../middleware");

let userValue;

router.post("/locate", function(req, res) {
    userValue = req.body.city;
    res.redirect("/sites");
});

router.get("/", async (req,res) => {
    const allSites = await Sites.find({});
    res.render("FishingSites/sites",{Sites:allSites, value:userValue});
});

router.post("/", middleware.isLoggedIn, async (req,res) => {
    const newlyCreatedSite = {
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
    await Sites.create(newlyCreatedSite);
    res.redirect("/sites");
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
   res.render("FishingSites/new"); 
});


router.get("/:id",async (req, res) => {

    const foundSite = await Sites.findById(req.params.id).populate("comments");

    let LoggedIn = false;
    let trueSiteOwnership = false;
    if(req.isAuthenticated()){
        LoggedIn = true;
        if (foundSite.author.id.equals(req.user._id)) {
        trueSiteOwnership = true;
      }
    }
    //render show template with that fishingSite
    res.render("FishingSites/show", {site: foundSite, trueSiteOwnership: trueSiteOwnership, LoggedIn: LoggedIn});
    });

router.delete("/:id", middleware.checkSiteOwnership, async (req,res) => {
    const site = await Sites.findById(req.params.id);
    site.remove();
    res.redirect("/sites");
});

router.get("/:id/edit", middleware.checkSiteOwnership, async (req, res) => {
    const foundSite = await Sites.findById(req.params.id);
    res.render("FishingSites/edit", {site: foundSite});
})

router.put("/:id", middleware.checkSiteOwnership, async (req,res) => {
    await Sites.findByIdAndUpdate(req.params.id, req.body.site);
    res.redirect("/sites/" + req.params.id);
});

module.exports = router;
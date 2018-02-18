var express = require("express");
var router = express.Router();

router.get("/", function(req,res){
      res.render("landing");
});

router.get("/error",function(req, res){
    res.render("construction");
});

module.exports = router;


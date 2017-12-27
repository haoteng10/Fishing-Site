var express = require("express");
var app = express();
app.set("view engine", "ejs");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req,res){
      res.render("landing");
});

app.get("/sites", function(req,res){
      res.render("sites");
});

app.post("/sites/locate",function(req, res) {
    var value = req.body.city;
    if (value === "NYC") {
        res.redirect("/sites/nyc");
    }else{
       res.redirect("/error"); 
    }
});

app.get("/sites/nyc",function(req, res) {
    res.redirect("/error");
})

app.get("/error",function(req, res) {
    res.render("construction");
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The server has been started!");
});
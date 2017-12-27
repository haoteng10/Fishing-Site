var express = require("express");
var app = express();
var mongoose = require("mongoose");
app.set("view engine", "ejs");

mongoose.connect('mongodb://localhost/my_database', {useMongoClient: true});

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var fishingSite = [{
    name: "Great Grand Park",
    url : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT84UgoxCM4rb51iQm-AxgYKxijqTPoTF-Ge59RtNJRQPnvqVsv"}
    ];

app.get("/", function(req,res){
      res.render("landing");
});

app.get("/sites", function(req,res){
      res.render("sites");
});

app.post("/sites", function(req,res){
    
});

app.get("/sites/new",function(req, res) {
   res.render("new"); 
});

// app.post("/sites/locate",function(req, res) {
//     var value = req.body.city;
//     if (value === "NYC") {
//         res.redirect("/sites/nyc");
//     }else{
//       res.redirect("/error"); 
//     }
// });

app.get("/sites/:id",function(req, res) {
    res.redirect("/error");
})

app.get("/error",function(req, res) {
    res.render("construction");
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The server has been started!");
});
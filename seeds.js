var mongoose = require("mongoose");
var Sites = require("./models/FishingSite");
var Comment = require("./models/Comment");

var data = [
    {
        name: "Atlantic Ocean",
        url: "http://davidselvey.com/imgs/2015-6%20North%20America/18%209%2015%20016w.jpg",
        location: "NYC",
        description:  "Just called Atlantic Ocean"
    },
    {
        name: "Pacific Ocean",
        url: "http://upload.wikimedia.org/wikipedia/commons/f/f3/South_east_cape_tasmania.jpg",
        location: "LA",
        description: "Just called Pacific Ocean"
    },
    {
        name: "Los Angelas River",
        url: "https://images.adsttc.com/media/images/5683/4ff5/e58e/ce62/ae00/01d1/large_jpg/6869712174_d403e7cc54_o.jpg?1451446232",
        location: "LA",
        description: "A manned made river. I don't think you can fish here."
    }
]

function SeedDB(){
    // Remove all fishing-sites
    Sites.remove({},function(err){
        if (err){
            console.log(err);
        } else {
            console.log("FishingSites removed.");
            data.forEach(function(seed){
                Sites.create(seed, function(err, createdSite){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("added a fishing-site");
                        Comment.create({text: "Blah Blah Blah", author: "Default"}, function(err, createdComment){
                            if (err){
                                console.log(err);
                            } else {
                                createdSite.comments.push(createdComment);
                                createdSite.save();
                                console.log("Comment created and saved");
                            }
                        })
                    }
                });
            });
        }
    });
}

module.exports = SeedDB; 
var mongoose = require("mongoose");

// FishingSite SCHEMA SETUP
var siteSchema = new mongoose.Schema({
   name: String,
   url: String,
   location: String,
   description: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Site", siteSchema);
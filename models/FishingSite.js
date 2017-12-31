var mongoose = require("mongoose");

// FishingSite SCHEMA SETUP
var siteSchema = new mongoose.Schema({
   name: String,
   url: String,
   location: String,
   description: String
});

module.exports = mongoose.model("Site", siteSchema);
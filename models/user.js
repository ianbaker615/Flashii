var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  decks:  [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deck"
    }
  ]
});

userSchema.plugin(passportLocalMongoose); //take package and add methods to Schema

module.exports = mongoose.model("User", userSchema);
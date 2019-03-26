var mongoose = require("mongoose");

var cardSchema = new mongoose.Schema({
  term: String,
  definition: String,
});

module.exports = mongoose.model("Card", cardSchema);

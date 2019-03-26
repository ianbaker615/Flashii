var mongoose = require("mongoose");


//SCHEMA SETUP FOR DECK
var deckSchema = new mongoose.Schema({
  name: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  cards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card"
    }
  ]
});

//adding a pre hook to delete cards when deck is deleted
const Card = require('./card');
deckSchema.pre('remove', async function() {
  await Card.deleteMany({
    _id: {
      $in: this.cards
    }
  });
});

module.exports = mongoose.model("Deck", deckSchema); //make model and export for use in app.js
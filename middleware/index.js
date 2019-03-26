var Deck = require("../models/deck");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

middlewareObj.checkDeckOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Deck.findById(req.params.id, function(err, foundDeck){
      if(err){
        console.log(err);
      } else {
        if(foundDeck.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}

module.exports = middlewareObj
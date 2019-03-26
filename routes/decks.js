var express = require("express");
var router = express.Router();
var Deck = require("../models/deck");
var User = require("../models/user");
var middleware = require("../middleware") //can leave /index.js off bc it's a special always included filename

//========================
//        DECK ROUTES
//========================
//INDEX
router.get("/decks", function(req, res){
  //get all decks from db
  Deck.find({}, function(err, allDecks){
    if(err){
      console.log(err);
    } else {
      res.render("decks/index", {decks:allDecks});//render decks.ejs with decks from allDecks from callback
    }
  })
});

//NEW - must come before SHOW route
router.get("/decks/new", middleware.isLoggedIn, function(req, res){
  res.render("decks/new");
});

//CREATE
router.post("/decks", middleware.isLoggedIn, function(req, res){
  var name = req.sanitize(req.body.name);
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  newDeck = {name: name, author: author};

  User.findById(author.id, function(err, user){
    if(err){
      console.log(err);
    } else {
      Deck.create(newDeck, function(err, newlyCreatedDeck){
        if(err){
          console.log(err);
        } else {
            newlyCreatedDeck.save();
            user.decks.push(newlyCreatedDeck); //add deck to user's decks arrary
            user.save(); //save deck to user
            console.log(newlyCreatedDeck);
            res.redirect("/decks");
        }
      });
    }
  });
});

//SHOWV2 - must come after NEW route
router.get("/decks/:id", function(req, res){
  //find deck w provided id
  Deck.findById(req.params.id).populate("cards").exec(function(err, foundDeck){
    if(err){
      console.log(err);
    } else {
      console.log(foundDeck);
      res.render("decks/show", {deck: foundDeck});
    }
  });
});


//EDIT
router.get("/decks/:id/edit", middleware.checkDeckOwnership, function(req, res){
  Deck.findById(req.params.id, function(err, foundDeck){
    res.render("decks/edit", {deck: foundDeck});
  });
});

//UPDATE
router.put("/decks/:id", middleware.checkDeckOwnership, function(req, res){
  req.body.name = req.sanitize(req.body.name);
  Deck.findByIdAndUpdate(req.params.id, {name: req.body.name}, function(err, updatedDeck){
    if(err){
      console.log(err);
    } else {
      res.redirect("/decks/" + req.params.id);
    }
  });
});

//DESTROY
router.delete("/decks/:id", middleware.checkDeckOwnership, function(req, res){
  Deck.findById(req.params.id, function(err, deck){
    if(err){
      console.log(err);
    } else {
      deck.remove(); //uses pre hook on deck model to delete decks cards
      res.redirect("/decks");
    }
  });
});

module.exports = router;

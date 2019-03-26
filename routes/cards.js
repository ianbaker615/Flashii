var express = require("express");
var router = express.Router();
var Card = require("../models/card");
var Deck = require("../models/deck");
var middleware = require("../middleware") //can leave /index.js off bc it's a special always included filename

//========================
//      CARD ROUTES
//========================

//New
//replaced isLoggedIn w checkDeckOwnership - right call?
router.get("/decks/:id/cards/new", middleware.checkDeckOwnership, function(req, res){
  Deck.findById(req.params.id, function(err, deck){
    if(err){
      console.log(err);
    } else {
      res.render("cards/new", {deck: deck});
    }
  });
});

//Create
//replaced isLoggedIn w checkDeckOwnership - right call?
router.post("/decks/:id/cards", middleware.checkDeckOwnership, function(req, res){
  //lookup card using id
  Deck.findById(req.params.id, function(err, deck){
    if(err){
      console.log(err);
    } else {
      Card.create(req.body.card, function(err, card){
        if(err){
          console.log(err);
        } else {
          deck.cards.push(card);
          deck.save();
          res.redirect("/decks/" + deck._id);
        }
      });
    }
  });
});

//Edit
router.get("/decks/:id/cards/:card_id/edit", middleware.checkDeckOwnership, function(req, res){
  Card.findById(req.params.card_id, function(err, foundCard){
    if(err){
      console.log(err);
      res.redirect("back");
    } else {
      res.render("cards/edit", {deck_id: req.params.id, card: foundCard});
    }
  });
});

//Update
router.put("/decks/:id/cards/:card_id", middleware.checkDeckOwnership, function(req, res){
  Card.findByIdAndUpdate(req.params.card_id, req.body.card, function(err, updatedTerm){
    console.log(req.body.card.term);
    if(err){
      console.log(err);
      res.redirect("back");
    } else {
      res.redirect("/decks/" + req.params.id);
    }
  });
});

//Destroy
router.delete("/decks/:id/cards/:card_id", middleware.checkDeckOwnership, function(req, res){
  Card.findByIdAndRemove(req.params.card_id, function(err, deletedCard){
    if(err){
      console.log(err);
    } else {
      console.log("deleted card: " + deletedCard);
      res.redirect("/decks/" + req.params.id);
    }
  });
});

module.exports = router;
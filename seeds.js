var mongoose = require("mongoose");

var Deck   = require("./models/deck"),
    Card   = require("./models/card");
 
var data = [
    {
        name: "Math", 
        author: {
          id : "588c2e092403d111454fff76",
          username: "Jack"
        }
    },
    {
        name: "History", 
        author: {
          id : "588c2e092403d111454fff71",
          username: "Jill"
        }
    },
    {
        name: "Science", 
        author: {
          id : "588c2e092403d111454fff77",
          username: "Jane"
        }
    }
]
 
function seedDB(){
   //Remove all decks
   Deck.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed decks!");
        Card.deleteMany({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed cards!");
             //add a few decks
            data.forEach(function(seed){
                Deck.create(seed, function(err, deck){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a deck");
                        //create a card
                        Card.create(
                            {
                                term: "Homer's last name",
                                definition: "Simpson"
                            }, function(err, card){
                                if(err){
                                    console.log(err);
                                } else {
                                    deck.cards.push(card);
                                    deck.save();
                                    console.log("Created new card");
                                }
                            });
                    }
                });
            });
        });
    }); 
}
 
module.exports = seedDB;
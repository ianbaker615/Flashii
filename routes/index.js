var express = require("express");
var router = express.Router({mergeParams: true});
var passport = require("passport");
//require models
var User = require("../models/user");

//LANDING PAGE
router.get("/", function(req, res){
  res.render("landing");
});

//========================
//      AUTH ROUTES
//========================
//show register page
router.get("/register", function(req, res){
  res.render("register");
});

//handle user signup
router.post("/register", function(req, res){
  User.register(new User({username: req.body.username}), req.body.password, function(err, user){ //user obj, then password
    if(err){
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function(){ // log user in and run session
        res.redirect("/decks");
      });
    }
  });
});

//========================
//      LOGIN ROUTES
//========================

router.get("/login", function(req, res){
  res.render("login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/decks",
  failureRedirect: "/login"
}), function(req,res){
});

router.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

module.exports = router;
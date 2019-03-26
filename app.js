var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    expressSanitizer      = require("express-sanitizer"),//has to come after body-parser. sanitize input
    methodOverride        = require("method-override"),
    seedDB                = require("./seeds"),
    passport              = require("passport"), //auth packages
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

//require models
var User = require("./models/user"),
    Deck = require("./models/deck"),
    Card = require("./models/card");

//require routes
var deckRoutes  = require("./routes/decks"),
    cardRoutes  = require("./routes/cards"),
    indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost:27017/flashii", { useNewUrlParser: true, useFindAndModify: false });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); //don't have to have .ejs ext on files
app.use(methodOverride("_method"));//allows us to use PUT requests in our forms
app.use(expressSanitizer()); 
seedDB();

// authentication passport configuration
app.use(require("express-session")({
  secret: "Ride the lightning into the abyss",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize()); // sets up passport for our app
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // read, encode, decode, etc for sessions
passport.deserializeUser(User.deserializeUser()); // ^

//use index routes
app.use(deckRoutes);
app.use(cardRoutes);
app.use(indexRoutes);

const port = 6969;
app.listen(port, () => {
  console.log(`API Available on http://localhost:${port}`)
});

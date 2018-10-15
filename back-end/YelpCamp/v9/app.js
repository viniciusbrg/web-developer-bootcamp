const express               = require("express"),
      app                   = express(),
      bodyParser            = require("body-parser"),
      mongoose              = require("mongoose"),
      expressSession        = require("express-session"),
      methodOverride        = require("method-override"),
      passport              = require("passport"),
      LocalStrategy         = require("passport-local"),
      passportLocalMongoose = require("passport-local-mongoose"),
      fillDB                = require("./fill_db"),
      User                  = require("./models/user")

const commentRoutes    = require("./routes/comments"),
      campgroundRoutes = require("./routes/campgrounds"),
      indexRoutes      = require("./routes/index");

app.use(methodOverride("_method"));

// express configs
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// passport configs
app.use(expressSession({
    secret: "I like ducks",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect("mongodb://localhost/yelp_camp");

// fillDB();

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use(indexRoutes);

app.listen(3000);
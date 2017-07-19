const express         = require("express");
const bodyParser      = require("body-parser");
const mongoose        = require("mongoose");
const path            = require("path");
const passport        = require("passport");
const LocalStrategy   = require("passport-local");
const methodOverride  = require("method-override");
const flash           = require("connect-flash");
const User            = require("./models/user");
const Campground      = require("./models/campground");
const Comment         = require("./models/comment");
const seedDB          = require("./seeds");

// requiring routes
const campgroundRoutes = require("./routes/campgrounds");
const commentRoutes    = require("./routes/comments");
const accountRoutes    = require("./routes/accounts");
const indexRoutes      = require("./routes/index");

const app = express();

mongoose.connect("mongodb://phil:tang@ds163232.mlab.com:63232/philtang");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
app.use(flash());

// Passport configuration
app.use(require("express-session")({
  secret: "It's a secret!",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.locals.moment = require("moment");

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/accounts", accountRoutes);

app.listen(process.env.PORT || 9000, () => {
  console.log("Server has started...");
});

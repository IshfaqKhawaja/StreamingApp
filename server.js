const express = require("express");
const app = express();
const session = require('express-session');
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoute");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 6000;
const cors = require('cors')
const bodyParser = require('body-parser');

const passport = require('passport'); 

var userProfile;

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '676976343192-q85kfd6sp60s67gepvruv9giohr4qfuj.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

app.set('view engine', 'ejs');

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
  res.render('pages/auth');
});

app.get('/success', (req, res) => {
 res.send(userProfile)
});
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:8000/auth/google/callback"
},
function(accessToken, refreshToken, profile, done) {
    userProfile=profile;
    return done(null, userProfile);
}
));

app.get('/auth/google', 
passport.authenticate('google', { scope : ['profile', 'email'] }),
);

app.get('/auth/google/callback', 
passport.authenticate('google', { failureRedirect: '/error' }),
async(req, res)=> {
  // Successful authentication, redirect success.
  const { password, confirmPassword, userName } =
      req.body;

    try {
      
      if(password != confirmPassword){
        res
          .status(401)
          .send({ status: false, message: "Confirm Password and Password do not match" });
          return;
      }else{
      const userExist = await user.findOne({ email: userProfile.emails[0].value });
      if (userExist) {
        res
          .status(409)
          .send({ status: false, message: "User Already Exists!!" });
        return;
      }

      const newCreatedUser = await user.create({
        email: userProfile.emails[0].value,
        password,
        userName
      })
      const newUser = await newCreatedUser.save();

      res.status(200).json({ status: true, result: "User Created" });
    }
  // };

    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ status: false, message: err.message });
    }
  console.log("ABHI")
  
//   res.redirect('/success');
}); 

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
//app.use(  cors({    origin: "*" }));
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   next();
//   });
const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE'
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};

app.use(cors(corsOpts));

// user API
app.use("/api/v1/user/", userRoutes)
// app.use("/test", google)

app.listen(port, () => {
  console.log(`server listening on ${port}`);
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("connected to mongodb"))
    .catch(() => console.log("DB not connected"));
});
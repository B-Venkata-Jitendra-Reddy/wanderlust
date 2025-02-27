if(process.env.NODE_ENV != "production") { //this are used only by development side only not for production or clint side because to proctec credentials from others
    require('dotenv').config(); //required .env file for store credentials
}
// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');  //Mongos session storing
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratrgy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


// const mongo_url = "mongodb://127.0.0.1:27017/wanderlust"
const dbUrl = process.env.ATLASDB_URL;

main().then( () => {
    console.log("Connected TO DB")
}).catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect(dbUrl);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//Mongo session storing (we can logged in to 14days after 14 days autimaticalu logged out)
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600, //used to store session to 24 hours after logged out
});

store.on("error", () => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {   //This object is used to configure session management when using the express-session middleware in an Express.js application.
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  //days, hours, miniuts, seconds, milli seconds,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

// app.get("/", (req, res) => {
//     res.send("working");
// });

app.use(session(sessionOptions));   //use before listings routess
app.use(flash());  //use before listings routes

app.use(passport.initialize()); //middleware
app.use(passport.session());  //middleware
passport.use(new LocalStratrgy(User.authenticate())); //Generates a function that is used in passport's LocalStrategy and also use static authenticate method of model in LocalStrategy

//use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());  //Generates a function that is used by passport to serialize users into the session
passport.deserializeUser(User.deserializeUser()); //Generates a function that is used by passport to deserialize users into thesession

//flash & login,logout,signup Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");  //flash middleware
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user; //in req.user store if user logged in return object if not user logged in,sign up return undefined
    // console.log(res.locals.success);
    next();
});

//login Demo
// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "Jittu@gmail.com",
//         username: "delta-student",
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });


app.use("/listings", listingRouter);    //this /listings is comman path
app.use("/listings/:id/reviews", reviewRouter);     //this /listings/:id/reviews is comman path
app.use("/", userRouter);


// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My villa",
//         description: "by near the beach",
        //we skiped image
//         price: 1200,
//         location: "calangute , goa",
//         country: "india",
//     });

//     await sampleListing.save();
//     console.log("sample was saved")
//     res.send("successful test");
// });

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
   let {statusCode = 500, message = "Something Went Wrong!"} = err;
   res.status(statusCode).render("error.ejs", { message });
//    res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("App is listening to the port 8080");
});
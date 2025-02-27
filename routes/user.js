const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

//SignUp User
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

//login User
router.route("/login")
.get(userController.renderLoginForm)
.post(
    saveRedirectUrl,  //here save redirectUrl
    passport.authenticate("local", { //Passport provides an authenticate() function, which is used as route middleware to authenticate requests user.
        failureRedirect: '/login',  //use when user enter wrong username and password this function redirect if /login page
        failureFlash: true,  //use when user enter wrong username and password this function is to flash message on login page
    }),
    userController.login
);

//logout user
router.get("/logout", userController.logout);


module.exports = router;
const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");


//validateListing middleware
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

//validateReview middleware
// const validateReview = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body);
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     } 
// }



module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {  //This (isAuthenticated) returns true if the user is authenticated, meaning they have an active session. or It returns false if the user is not authenticated.
        req.session.redirectUrl = req.originalUrl;  //when the user not loggedin we save original URL
        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};

//redirectUrl middelware
module.exports.saveRedirectUrl = (req, res, next) => { //he have to call saveRedirectUrl in (routes/user.js) /login session
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;  //redirectUrl save in locals because(passport can not access to delete locals)
    }
    next();
};

//Authorization for Listings middleware
module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;     //accessing ID
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


//Authorization for Review Author only middleware
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;     //accessing ID
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
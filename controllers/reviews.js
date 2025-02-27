const Listing = require("../models/listing");
const Review = require("../models/review");


//Post Review Route
module.exports.createReview =  async (req, res) => {    //here have to define(validateReview)
    let listing = await Listing.findById(req.params.id);   //accessing ID
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;  //(req.user._id) he the author of newReview 
    console.log(newReview); 

    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();  //.save(); use to when we want to change the existed item

    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
    // console.log("new review saved");
    // res.send("new review saved");
}

//Delete Review Route
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;      //accessing ID

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});  //this is used to when we deleted perticular listing reviews and also PULL the review id in listing and delete using $pull operator
    await Review.findByIdAndDelete(reviewId);    //find the Id and delete that perticular reviews

    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
}
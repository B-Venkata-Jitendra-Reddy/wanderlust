const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { required } = require("joi");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {  //listing Owner in our platform have registered User. || this is not an Array
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  // geometry: {
  //   type: {
  //     type: String, //Dont do `{ location: { type: string} } }`
  //     enum: ["Point"], //"location.type" must be "point"
  //     required: true
  //   },
  //   coordinates: {
  //     type: [Number],
  //     required: true,
  //   },
  // },


  // category: {   //this ia an self work
  //   type: String,
  //   enum: ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castles", "Amazinf Pools", "Camping", "Farms", "Beachfront"],
  // },
});


//The goal of this middleware is to delete all the reviews related to a listing when that listing is deleted.
listingSchema.post("findOneAndDelete", async (listing) => { //This sets up a Mongoose post middleware that runs after a findOneAndDelete operation is completed on a listing document. The findOneAndDelete method is a Mongoose method that finds a document by the provided conditions and then deletes it from the database.
  if (listing) {   //Checks whether the listing exists. If the listing is not found, this block will not execute.
    await Review.deleteMany({ _id: { $in: listing.reviews } });  //This line is saying, "If the listing exists, delete all reviews whose _id is in the reviews array of the listing."
  }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

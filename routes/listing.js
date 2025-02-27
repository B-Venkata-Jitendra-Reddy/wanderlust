const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");

const multer  = require('multer'); //required Multer library
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });  //multer will save files in (storage) cloudinary


//index Route
//Create Route
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing)); //in upload.single in that adding image field name(listing[image])



//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);


//Show Route
//Update Route
//Delete Route
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))  //in upload.single in that adding image field name(listing[image])
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
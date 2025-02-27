const Listing = require("../models/listing");
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const  mapToken = process.env.MAP_TOKEN;                                                 //pending map related path
// const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//index Route
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs", { allListings });
};

//New Route
module.exports.renderNewForm = (req, res) => {
    // console.log(req.user);
    res.render("listings/new.ejs");
}

//Show Route
module.exports.showListing = async (req, res) => {
    let {id} = req.params;  //accessing ID
    const listing =  await Listing.findById(id)
        .populate({   //populate() generally refers to the process of filling a data structure, such as a form, table, dropdown menu, or database, with data dynamically.
            path: "reviews",
            populate: {   //this is nested populate
                path: "author",
            },
        })
        .populate("owner"); 
    if(!listing) {
        req.flash("error", "Listing Your Requested Does Not Exist!");
        res.redirect("/listings");
    }
    console.log(listing); //we can access owner here
    res.render("listings/show.ejs", { listing });
}

//Create Route
module.exports.createListing = async (req, res, next) => {
    // let response = await geocodingClient.forwardGeocode({
        // query: 'New Delhi, India',    //config.limit number Limit the number of results returned. (optional, default 5) coordinats
    //     limit: 1
    //   })
    //     .send()                                 ????Map coordinats is pending
    // console.log(response);
    // res.send("Done!");



    // let {title, description, image, price, country, location} = req.body;              //insted of this line we write below line(because it is easy)
    // let listing = req.body.listing;

    let url = req.file.path;
    let filename = req.file.filename; //thie req.file will storing a file related data
    // console.log(url, "..", filename);  //to access url and filename in VS terminal

    const newListing = new Listing(req.body.listing);
    // console.log(req.user); //access owner
    newListing.owner = req.user._id; //saving current user name  //adding user name to every listings

    newListing.image = {url, filename};  //using filename and url in backend
    
    await newListing.save()
    req.flash("success", "New Listing Created!");
    res.redirect("/listings"); 
    }

//Edit Route
module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;   //accessing ID
    const listing =  await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing Your Requested Does Not Exist!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

    res.render("listings/edit.ejs", { listing, originalImageUrl });
}

//Update Route
module.exports.updateListing = async (req, res) => {
    let {id} = req.params;     //accessing ID
    // let listing = await Listing.findById(id);
    // if (!listing.owner.equals(res.locals.currentUser._id)) {     //this code is Authorization for listing
    //     req.flash("error", "You don't have permission to Edit");
    //     return res.redirect(`/listings/${id}`);
    // }

    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing });  //  {...req.body.listing } this is an js object it will deconstruct converts into individual values and this well be pass into the new updated value

    if (typeof req.file !== "undefined") { //typeof is a operator used in js every variable value checking that undefinde or not
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);    //this (`/listings/${id}`) is redirect to show form
}

//Delete Route
module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;    //accessing ID
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}
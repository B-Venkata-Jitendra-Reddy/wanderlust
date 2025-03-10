const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({...obj, owner: "67b2dbb38ed3444c2159b182" })); //Add owner object in all listings //(initData) Accessing data array and applying map() function and map() used evers individual object to add new Proparty like (owner)
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
//refer about map()


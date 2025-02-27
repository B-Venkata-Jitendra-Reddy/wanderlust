const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose);  //Mongoose schema in a Node.js application. it is used to add automatically salting and hashed form for the passwords

module.exports = mongoose.model('User', userSchema);
const mongoose = require("mongoose");
const express = require("express");


const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    mobile : {
        type : String,
        required : false
    },
    gender : {
        type : String,
        enum : ["male", "female"]
    },
    isDeleted : {
        type : Boolean,
        default : false
    },
},
  { timestamps : true}
);



module.exports = mongoose.model( "user", userSchema )
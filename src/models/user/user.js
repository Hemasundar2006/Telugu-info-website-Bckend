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
    qualification : {
        type : String,
        required : true,
        enum : [
            "High School",
            "Intermediate",
            "Bachelor's Degree",
            "Master's Degree",
            "Ph.D.",
            "Diploma",
            "Other"
        ]
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        enum : ["admin", "user"],
        default : "user"
    },
    isDeleted : {
        type : Boolean,
        default : false
    },
},
  { timestamps : true}
);



module.exports = mongoose.model( "user", userSchema )
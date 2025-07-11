const mongoose = require('mongoose');
const express = require('express');

const jobPostSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true,
        default: function() {
            return 'JOB' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
        }
    },
    jobTitle : {
        type : String,
        required : true
    },
    companyName : {
        type : String,
    },
    jobType : {
        type : String,
        enum : ["fullTime", "partTime", "contract-based", "temporary"],
        default : "fullTime"
    },
    location : {
        type : String,
        required : true
    },
    workMode : {
        type : String,
        enum : ["workFromHome", "workFromOffice", "Remote"],
        default : "workFromOffice"
    },
    requiredExperience : {
        type : Number
    },
    description : {
        type : String,
    },
    eligibility : {
        type : String
    },
    jobSpecification : {
        type : String
    },
    linkToApply : {
        type : String
    },
    youTubeLink : {
        type : String
    },
    startDate : {
        type : Date,
        default : Date.now()
    },
    lastDate : {
        type : Date,
        default : Date.now()
    },
    salary : {
        type : String
    },
    feesStructure : [
        {
        category  : {
            type : String
        },
        amount : {
            type : String
        }
    },
      { _id : false }
   ],
   companyLogo : {
    type : String,
   },
   metaTitle : {
    type : String
   },
   metaDescription : {
    type : String
   },
   isFeatured : {
    type : Boolean,
    default : false
   },
   pdfLink: {
    type : String
   },
   isActive : {
    type : Boolean,
    default : false
   },
   isDeleted : {
    type : Boolean,
    default : false
   },
},
{ timestamps : true}

);




module.exports = mongoose.model( "jobPost", jobPostSchema )

    

 
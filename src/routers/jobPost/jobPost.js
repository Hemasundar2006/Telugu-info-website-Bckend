const express = require('express');
const mongoose = require('mongoose');
const jobPostDB = require('../../models/jobPost/jobPost'); // Assuming you have a JobPost model

const router = express.Router();

router.post('/create-jobPost', async (req, res) => {
    try {
        const data = req.body;
        const jobPost = new jobPostDB(data);
        await jobPost.save();
        res.status(200).json({ success : true, data : jobPost });
    } catch (error) {
        res.status(500).json({ success : false, message : error.message });
    }
});


router.get("/all-jobPost", async (req, res) => {
    try {
        const jobPosts = await jobPostDB.find();
        res.status(200).json({ success : true, data : jobPosts } )
    } catch (error) {
        res.status(500).json({ success : false, message : error.message });
    }
});


router.get('get-jobPost/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const jobPost = await jobPostDB.findById(id);
        if (!jobPost) {
            return res.status(404).json({ success : false , message : "jobPost not Found" });
        }
        res.status(200).json({ success : true, data : jobPost });
    } catch (error) {
        res.status(500).json({ success : false, message : error.message});
    }
});

// Update a job post by ID
router.patch('/update-jobPost/:id', async (req, res) => {
    try {
        const { id } = req.params.id;
        const data = req.body;
        const jobPost = await job.findByIdAndUpdate(id, { $set : data },  { new: true});
        if (!jobPost) {
            return res.status(404).json({ success : false, message : "Jobpost not found"});
        }
        res.status(200).json({ success : true, data : jobPost } );
    } catch (error) {
        res.status(500).json({ success : false, message : error.message });
    }
});



router.delete('/delete-jobPost/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const jobPost = await jobPostDB.findByIdAndUpdate(id, { $set: { isDeleted: true } }, { new: true });
        if (!jobPost) {
            return res.status(404).json({ success: false, message: "jobPost not found" });
        }
        res.status(200).json({ success: true, data: jobPost });
    } catch (error) {
        res.status(500).json( { success : false, message :  error.message });
    }
});

module.exports = router;
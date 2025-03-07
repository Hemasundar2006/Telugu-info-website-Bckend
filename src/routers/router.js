const express = require("express");
const router = express.Router();

const userRouter = require("./user/user")
const jobPostRouter = require("./jobPost/jobPost")


router.use("/user", userRouter);

router.use("/jobPost", jobPostRouter);

module.exports = router;
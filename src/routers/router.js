const express = require("express");
const router = express.Router();

const userRouter = require("./user/user");
const jobPostRouter = require("./jobPost/jobPost");
const internshipRouter = require("./internship/internship");
const scholarshipRouter = require("./scholarship/scholarship");
const partTimeJobRouter = require("./partTimeJob/partTimeJob");

router.use("/user", userRouter);
router.use("/jobPost", jobPostRouter);
router.use("/internship", internshipRouter);
router.use("/scholarship", scholarshipRouter);
router.use("/partTime", partTimeJobRouter);

module.exports = router;
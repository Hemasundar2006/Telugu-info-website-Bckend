const mongoose = require("mongoose");
require("dotenv").config();

const connectdb = async () => {
  try {
    const dburi = process.env.DB_CONNECTION_STRING;

    if (!dburi) {
      throw new Error("Missing DB_CONNECTION_STRING in .env file");
    }

    await mongoose.connect(dburi);
    console.log("MongoDB connected 🚀");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectdb;

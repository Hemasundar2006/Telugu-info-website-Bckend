const mongoose = require("mongoose");
require("dotenv").config();
const connectdb = async () => {
  const dburi = `${process.env.DB_CONNECTION_STRING}`;
  mongoose
    .connect(dburi, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((result) => console.log("mongodb connected 🚀"))
    .catch((err) => console.log(err));
};

module.exports = connectdb;
